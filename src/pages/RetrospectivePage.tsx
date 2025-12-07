import {YouTubePlayer} from "@/components/YouTubePlayer";
import styles from "./RetrospectivePage.module.scss";

interface RetrospectivePageType {
    videoId: string;
}

const RetrospectivePage = ({videoId}: RetrospectivePageType) => {
    return <div className={styles.container}>
        <YouTubePlayer videoId={videoId} />
        <p>
            <span>hoge</span>
            <span>fuga</span>
        </p>
    </div>
}

export default RetrospectivePage;
