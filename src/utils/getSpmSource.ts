export function getSpmPre() {
    const { search = '' } = window.location;
    const spmPreRes = search.match(/spm_pre\=([A-Za-z0-9]+)/g);
    return spmPreRes ? (spmPreRes[1] || '') : '';
}

export function getSpmUrl() {
    const { search = '' } = window.location;
    const spmUrlRes = search.match(/spm_url\=([A-Za-z0-9]+)/g);
    return spmUrlRes ? (spmUrlRes[1] || '') : '';
}