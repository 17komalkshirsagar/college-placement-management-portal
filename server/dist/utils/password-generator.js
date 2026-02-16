export function generateAccountPassword(nameOrCompany, mobile) {
    const trimmedMobile = mobile.replace(/\D/g, '');
    if (trimmedMobile.length < 4) {
        throw new Error('Mobile number must have at least 4 digits');
    }
    const firstToken = nameOrCompany.trim().split(/\s+/)[0] ?? 'User';
    const safeFirstToken = firstToken.replace(/[^A-Za-z0-9]/g, '') || 'User';
    const last4 = trimmedMobile.slice(-4);
    return `${safeFirstToken}@${last4}`;
}
