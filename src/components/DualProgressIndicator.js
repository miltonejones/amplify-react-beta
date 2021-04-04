import './DualProgressIndicator.css';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function CircularProgressWithLabel(props) {
  const { value, outer, message } = props;
  return (
    <div className="dual-progress-container">
      <Box position="relative" display="inline-flex">
        {!0 && <CircularProgress color="inherit" style={{ position: 'absolute', top: -50, left: -50 }} size={100} />}
        <CircularProgress color="secondary" style={{ position: 'absolute', top: -100, left: -100 }} size={200} variant="determinate" value={outer} />
        <CircularProgress style={{ position: 'absolute', top: -80, left: -80 }} size={160} variant="determinate" value={value} />

        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            value,
          )}%`}</Typography>
        </Box>
      </Box>
      <div className="dual-progress-message">
        <div className="dual-progress-help">Please wait while we get ready...</div>
        <div>{message}</div>
      </div>
    </div>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function DualProgressIndicator() {
  const [progress, setProgress] = React.useState(10);
  const [outer, setOuter] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
      console.log({ progress })
      setOuter((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 25));

    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel message="This will be the message" outer={outer} value={progress} />;

}

export {
  CircularProgressWithLabel
}