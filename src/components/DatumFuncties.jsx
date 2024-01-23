import { format, parse, isValid ,parseISO} from 'date-fns'


Date.prototype.addDay = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export const GetMissieDagen = (startdatum, einddatum) => {

    let dagen = new Array();
    let start = new Date(startdatum)
    let einde = new Date(einddatum)

    let cDate = start.addDay(-1);
    while (cDate <= einde) {
        dagen.push(new Date(cDate))
        cDate = cDate.addDay(1)
    }
    return dagen
}

export const DateToYYYYMMDD = (datum)=>{
    return format(datum, "yyyy-MM-dd")
}

export const DateToDDMMYYYY = (datum)=>{
    return format(datum, "dd/MM/yyyy")
}