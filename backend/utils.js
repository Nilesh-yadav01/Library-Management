export const addDays = (date, days) => {

    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
};

export const calculateFine = (dueDate, returnDate = new Date()) => {

    const due = new Date(dueDate);
    const actual = new Date(returnDate);

    due.setHours(0, 0, 0, 0);
    actual.setHours(0, 0, 0, 0);

    const difference = actual - due;

    const lateDays = Math.max(
        0,
        Math.ceil(difference / (1000 * 60 * 60 * 24))
    );

    const fine = lateDays * 5;

    return fine;
};