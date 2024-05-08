import { format, parse, getHours, getMinutes, isEqual, isValid, parseISO, setHours, setMinutes } from 'date-fns'


Date.prototype.addDay = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export const GetMissieDagen = (startDatum, eindDatum) => {

    let dagen = new Array();
    let start = new Date(startDatum)
    let einde = new Date(eindDatum)

    let cDate = start.addDay(-1);
    while (cDate <= einde) {
        dagen.push(new Date(cDate))
        cDate = cDate.addDay(1)
    }
    return dagen
}

export const DateToYYYYMMDD = (datum) => {
    return format(datum, "yyyy-MM-dd")
}
export const DateToYYYYMMDDstring = (datum) => {
    return (format(datum, "yyyy-MM-dd")).toString()
}

export const DateToDDMMYYYY = (datum) => {
    return format(datum, "dd/MM/yyyy")
}

export const DatumVoorbij = (datum) => {
    let dat = new Date(datum)
    let vandaag = new Date()
    return dat < vandaag ? true:false
}

export const HHMM_To_date = (datum, tijd) => {
    let date = parse(datum, "dd/MM/yyyy", new Date())
    let times = tijd.split(':')
    date.setHours(times[0])
    date.setMinutes(times[1])
    return date
}

export const GetTijdFromDate = (datum) => {
    const date = datum.length > 0 ? new Date(datum) : new Date()
    return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`
}
export const CompareDates = (date1, date2) => {
    let datum1 = format(new Date(date1), 'ddMMyyyy')
    let datum2 = format(parseISO(date2), 'ddMMyyyy')
    return datum1 === datum2 ? true : false
}