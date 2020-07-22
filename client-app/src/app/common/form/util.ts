export const combineDateAndTime = (date: Date, time: Date) => {
    const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // starts from 0, and we need the actual no of months
    const day = date.getDate(); //returns the day of the month
    const dateString = `${year}-${month}-${day}`;


    return new Date(dateString + ' ' + timeString);
}