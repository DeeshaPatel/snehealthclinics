// Get nth occurrence of a weekday in a month
function getNthWeekday(year, month, weekday, nth) {

    const date = new Date(year, month, 1);

    let count = 0;


    while (date.getMonth() === month) {

        if (date.getDay() === weekday) {

            count++;

            if (count === nth) {
                return date;
            }

        }

        date.setDate(date.getDate() + 1);
    }

}



// Get last occurrence of weekday in a month
function getLastWeekday(year, month, weekday) {

    const date = new Date(year, month + 1, 0);


    while (date.getDay() !== weekday) {

        date.setDate(date.getDate() - 1);

    }


    return date;

}





// Calculate Easter Sunday
function getEasterSunday(year) {

    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;

    const d = Math.floor(b / 4);
    const e = b % 4;

    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);

    const h =
        (19 * a + b - d - g + 15) % 30;

    const i = Math.floor(c / 4);
    const k = c % 4;

    const l =
        (32 + 2 * e + 2 * i - h - k) % 7;

    const m =
        Math.floor((a + 11 * h + 22 * l) / 451);


    const month =
        Math.floor(
            (h + l - 7 * m + 114) / 31
        );


    const day =
        ((h + l - 7 * m + 114) % 31) + 1;


    return new Date(year, month - 1, day);

}





export function getOntarioHolidays(year) {


    const holidays = [];


    // New Year's Day
    holidays.push(
        new Date(year,0,1)
    );


    // Family Day - Third Monday February
    holidays.push(
        getNthWeekday(
            year,
            1,
            1,
            3
        )
    );


    // Good Friday
    const easter = getEasterSunday(year);

    holidays.push(
        new Date(
            easter.getFullYear(),
            easter.getMonth(),
            easter.getDate() - 2
        )
    );



    // Victoria Day - Last Monday before May 25
    holidays.push(
        getLastWeekday(
            year,
            4,
            1
        )
    );



    // Canada Day
    holidays.push(
        new Date(year,6,1)
    );



    // Labour Day - First Monday September
    holidays.push(
        getNthWeekday(
            year,
            8,
            1,
            1
        )
    );



    // Thanksgiving - Second Monday October
    holidays.push(
        getNthWeekday(
            year,
            9,
            1,
            2
        )
    );



    // Christmas
    holidays.push(
        new Date(year,11,25)
    );


    // Boxing Day
    holidays.push(
        new Date(year,11,26)
    );


    return holidays;

}





export function isHoliday(date){


const year = date.getFullYear();


const holidays =
getOntarioHolidays(year);



return holidays.some(
holiday =>
holiday.toDateString()
===
date.toDateString()
);


}