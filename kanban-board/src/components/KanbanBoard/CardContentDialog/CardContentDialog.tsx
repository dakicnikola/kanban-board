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
    if (props.visible) {
      setNewLabel(props.label || '');
    }
  }, [props.label, props.visible]);

  const classNames = ["create-edit-card-modal"]
  if (!props.visible) {
    classNames.push("hidden")
  }

  return (
    <Rodal
      visible={props.visible}
      onClose={props.onClose}
      animation={"zoom"}
      className={classNames.join(" ")}
      aria-hidden={!props.visible}
    >
      {Boolean(props.title) &&
        <h3 data-testid={"card-content-title"}>{props.title}</h3>
      }
      <label htmlFor="card label">Card label</label>
      <textarea name="card label" id="card label" value={newLabel} onChange={onCardLabelChange} autoFocus />
      <div className={"action-buttons"}>
        <button onClick={props.onClose} className={"secondary"} name={"close-button"} type={"button"}>Close</button>
        <button onClick={handleSave} type={"submit"} name={"save-button"}>Save</button>
      </div>
    </Rodal>
  );
};

export default CardContentDialog;
