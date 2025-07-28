export const getUserDisplayName = (user: any) => {
    if (user.name) {
        return user.name;
    }

    if (user.phoneNumber) {
        const str = String(user.phoneNumber).replace(/\D/g, ''); // sadece rakamları al

        if (str.length !== 12 || !str.startsWith('994')) {
            return 'Bilinmeyen istifadəçi';
        }

        const parts = [];
        parts.push('+' + str.slice(0, 3));
        parts.push(str.slice(3, 5));
        parts.push(str.slice(5, 8));
        parts.push('**');
        parts.push('**');

        const formatted = parts.join(' ');
        return `${formatted}`;
    }

    return 'Anonim istifadəçi';
};