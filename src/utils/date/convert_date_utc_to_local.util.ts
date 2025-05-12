const convertDateUtcToLocal = (date:string) => {
    const utcDate = new Date(date);
    const localDate = utcDate.toLocaleString();
    return localDate
}

export default convertDateUtcToLocal;