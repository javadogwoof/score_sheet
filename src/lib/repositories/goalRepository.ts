import type { capSQLiteChanges } from '@capacitor-community/sqlite';
import { getDB } from '../db';
import type { Goal } from '../domain/types';
import { NotFoundError, RetryableError } from '../errors';
import { retryWithBackoff } from '../retry';

// Internal DB DTO
interface GoalDTO {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  deadline: string;
  completed: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * DTOをドメインモデルに変換
 */
const dtoToGoal = (dto: GoalDTO): Goal => ({
  id: dto.id,
  title: dto.title,
  description: dto.description ?? undefined,
  priority: dto.priority as Goal['priority'],
  deadline: dto.deadline,
  completed: dto.completed === 1,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

/**
 * 全ての目標を取得（優先度順: high → medium → low、同じ優先度内では期限が近い順）
 */
export const getAllGoals = async (): Promise<Goal[]> => {
  try {
    return await retryWithBackoff(async () => {
      const db = getDB();

      const result = await db.query(
        `SELECT * FROM goals
         ORDER BY
           CASE priority
             WHEN 'high' THEN 1
             WHEN 'medium' THEN 2
             WHEN 'low' THEN 3
           END ASC,
           deadline ASC,
           createdAt DESC`,
        [],
      );

      const goals = (result.values || []) as GoalDTO[];

      return goals.map(dtoToGoal);
    });
  } catch (_error) {
    throw new RetryableError('Failed to get all goals');
  }
};

/**
 * 目標を追加
 */
export const addGoal = async (data: {
  title: string;
  description?: string;
  priority: Goal['priority'];
  deadline: string;
}): Promise<string> => {
  const db = getDB();
  const now = Date.now();
  const goalId = crypto.randomUUID();

  try {
    await retryWithBackoff(() =>
      db.run(
        'INSERT INTO goals (id, title, description, priority, deadline, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          goalId,
          data.title,
          data.description ?? null,
          data.priority,
          data.deadline,
          0,
          now,
          now,
        ],
      ),
    );
  } catch (_error) {
    throw new RetryableError('Failed to add goal');
  }

  return goalId;
};

/**
 * 目標を更新
 */
export const updateGoal = async (
  goalId: string,
  data: {
    title?: string;
    description?: string;
    priority?: Goal['priority'];
    deadline?: string;
    completed?: boolean;
  },
): Promise<void> => {
  const db = getDB();

  // 既存の目標を取得
  const existingResult = await retryWithBackoff(() =>
    db.query('SELECT * FROM goals WHERE id = ? LIMIT 1', [goalId]),
  );

  const existingGoals = (existingResult.values || []) as GoalDTO[];
  if (existingGoals.length === 0) {
    throw new NotFoundError('Goal', goalId);
  }

  const existing = existingGoals[0];

  // 更新データをマージ
  const updated = {
    title: data.title ?? existing.title,
    description: data.description !== undefined ? data.description : existing.description,
    priority: data.priority ?? existing.priority,
    deadline: data.deadline ?? existing.deadline,
    completed: data.completed !== undefined ? (data.completed ? 1 : 0) : existing.completed,
    updatedAt: Date.now(),
  };

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run(
        'UPDATE goals SET title = ?, description = ?, priority = ?, deadline = ?, completed = ?, updatedAt = ? WHERE id = ?',
        [
          updated.title,
          updated.description,
          updated.priority,
          updated.deadline,
          updated.completed,
          updated.updatedAt,
          goalId,
        ],
      ),
    );
  } catch (_error) {
    throw new RetryableError('Failed to update goal');
  }

  if (result.changes?.changes === 0) {
    throw new NotFoundError('Goal', goalId);
  }
};

/**
 * 目標を削除
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  const db = getDB();

  let result: capSQLiteChanges;
  try {
    result = await retryWithBackoff(() =>
      db.run('DELETE FROM goals WHERE id = ?', [goalId]),
    );
  } catch (_error) {
    throw new RetryableError('Failed to delete goal');
  }

  if (result.changes?.changes === 0) {
    throw new NotFoundError('Goal', goalId);
  }
};
