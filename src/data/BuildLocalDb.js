import { useEffect, useState } from "react";
import { query } from "../AmplifyData";
import { CircularProgressWithLabel } from "../components/DualProgressIndicator";
import ConfirmDialog, { DialogConfig } from "../components/modal/ConfirmDialog";
import { LocalApi, READ_MODE } from "./LocalApi";
import { indexDbResponse, LocalDb, LOCAL_DATABASE_STATE } from "./LocalDb";
import { DATA_CONFIG } from "./ObjectConf";



function BuildLocalDb({ complete }) {
  const [progress, setProgress] = useState(0);
  const [outer, setOuter] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState('loading...');
  const [dialogProps, setDialogProps] = useState({});
  const ask = DialogConfig(setDialogProps);
  const mode = LocalApi.Mode;

  useEffect(() => {
    if (loaded) return;
    const configLength = DATA_CONFIG.length;
    const conn = indexDbResponse.subscribe(res => {
      const { state } = res;
      if (state === LOCAL_DATABASE_STATE.PROGRESS) {
        setProgress(res.progress);
      }
    });
    setLoaded(true);
    const build = () => {
      if (!DATA_CONFIG.length) {
        setProgress(0);
        setStatus('Done');
        conn.unsubscribe()
        complete()
        return;
      }
      const config = DATA_CONFIG.shift();
      const prog = Math.floor((((configLength + 1) - DATA_CONFIG.length) / configLength) * 100);
      setOuter(prog);
      LocalDb.connect().then(() => {
        LocalDb.tally(config.table)
          .then(res => {
            console.log('%s has %s rows', config.table, res)
            if (res === 0) {
              setStatus(`${config.text}...`)
              query(config.type).then(ret => {
                const { data } = ret;
                console.log({ data })
                LocalDb.insert(config.table, data)
                  .then(build)
              })
              return;
            }
            complete();
          }).catch(f => ask(f.toString(), 'an error occured').then(console.log))
      });
    }
    mode === READ_MODE.REMOTE ? complete() : build();
  }, mode);

  return (
    <div className="build-status">
      <ConfirmDialog {...dialogProps} />

      <CircularProgressWithLabel message={status} value={progress} outer={outer} />

    </div>
  )
}

BuildLocalDb.defaultProps = {
  complete: () => alert('DATABASE BUILD COMPLETE!')
}

export {
  BuildLocalDb
}