import { Icon, IconButton } from "@material-ui/core";
import { HtmlTooltip } from "./HtmlTooltip";

const ToolTipButton = ({ title, click, disabled, icon, css }) => {
  return (
    <div className={css}>
      <HtmlTooltip
        title={title}>
        <IconButton
          classes={{ root: 'icon-button-no-padding' }}
          onClick={click}
          color="inherit"
          disabled={disabled} >
          <Icon>{icon}</Icon>
        </IconButton>
      </HtmlTooltip>
    </div>
  );
}

export {
  ToolTipButton
}