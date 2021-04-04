import { CircularProgress, Fab, Icon } from "@material-ui/core";
import './ProgressPlay.css';

export default function ProgressPlay({ percent, play }) {
  return (
    <div class="progress-play-container btn-play-pause flex-centered">
      <div class="progress-play-button">
        <Fab
          color="primary"
          disabled={percent > 0}
          onClick={() => play()}
          aria-label="add to favorites"
        >
          <Icon>{percent > 0 ? 'pause_circle' : 'play_circle'}</Icon>
        </Fab>
      </div>
      <div class="progress-play-circle">
        {!!percent && (
          <CircularProgress size={56} variant="determinate" value={percent} />
        )}
      </div>
    </div>
  );
}
