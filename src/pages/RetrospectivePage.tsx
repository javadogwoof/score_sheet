import {YouTubePlayer} from "@/components/YouTubePlayer";
import styles from "./RetrospectivePage.module.scss";

interface RetrospectivePageType {
    videoId: string;
}

const RetrospectivePage = ({videoId}: RetrospectivePageType) => {
    return <div className={styles.container}>
        <YouTubePlayer videoId={videoId} />
        <form className={styles.form}>
            <label className={styles.label} htmlFor="memo">メモ</label>
            <textarea className={styles.memo} id={"memo"} />
        </form>
    </div>
}

export default RetrospectivePage;
