import { QInput, QSelect } from 'quasar';
import { defineBoot } from '#q-app/wrappers';

export default defineBoot(() => {
  QInput.props.outlined = { type: Boolean, default: true };
  QInput.props.dense = { type: Boolean, default: true };
  QInput.props.outlined = { type: Boolean, default: true };
  QSelect.props.outlined = { type: Boolean, default: true };
  QSelect.props.dense = { type: Boolean, default: true };
});
