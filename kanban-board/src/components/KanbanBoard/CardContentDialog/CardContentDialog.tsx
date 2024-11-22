import Rodal from "rodal";
import {ChangeEvent, useEffect, useState} from "react";
import "./card-content-dialog.scss"
import 'rodal/lib/rodal.css';

type TCardContentDialogProps = {
  visible: boolean;
  label?: string;
  title?: string
  onClose?: () => void
  onSave?: (newLabel: string) => void
}
const CardContentDialog = (props: TCardContentDialogProps) => {

  const [newLabel, setNewLabel] = useState<string>(props.label || '');

  const handleSave = () => {
    if (props.onSave) {
      props.onSave(newLabel)
    }
  }
  const onCardLabelChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    setNewLabel(ev.target.value)
  }

  useEffect(() => {
    setNewLabel(props.label || '');
  }, [props.label, props.visible]);

  return (<Rodal
      visible={props.visible}
      onClose={props.onClose}
      animation={"zoom"}
      className={"create-edit-card-modal"}
    >
      {Boolean(props.title) &&
        <h3>{props.title}</h3>
      }
      <label htmlFor="card label">Card label</label>
      <textarea name="card label" value={newLabel} onChange={onCardLabelChange} autoFocus />
      <div className={"action-buttons"}>
        <button onClick={props.onClose} className={"secondary"}>Close</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </Rodal>
  );
};

export default CardContentDialog;
