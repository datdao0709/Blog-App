import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.locale('vi');
dayjs.extend(relativeTime);

export const formatCommentTime = (createdAt, updatedAt) => {
    if (!createdAt) return '';

    const created = dayjs(createdAt);
    const updated = updatedAt ? dayjs(updatedAt) : null;

    let createdText = '';
    const diffDaysCreated = dayjs().diff(created, 'day');
    if (diffDaysCreated < 7) {
        createdText = created.fromNow();
    } else {
        createdText = created.format('DD/MM/YYYY HH:mm');
    }

    let updatedText = '';
    if (
        updated &&
        updated.isValid() &&
        !updated.isSame(created)
    ) {
        const diffDaysUpdated = dayjs().diff(updated, 'day');
        if (diffDaysUpdated < 7) {
            updatedText = `· chỉnh sửa ${updated.fromNow()}`;
        } else {
            updatedText = `· chỉnh sửa ${updated.format('DD/MM/YYYY HH:mm')}`;
        }
    }

    return `${createdText}${updatedText}`;
};
