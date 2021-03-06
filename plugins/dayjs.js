import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

export default ({ $dayjs, store }) => {
  $dayjs.extend(customParseFormat);
  $dayjs.extend(timezone);
  $dayjs.extend(relativeTime);
  $dayjs.extend(localizedFormat);

  $dayjs.locale(store.getters.settings.lang);
}
