import moment from 'moment-timezone'

export function getFilterPredicate(data: any, filter: string, listColumn: any): boolean {
    const matchFilter = []   
    if (listColumn) { 
        let listColumnFilter = listColumn.filter((o:any) => o.filter == true)
        for (const columnFilter of listColumnFilter) {
            let dataColumn = getJsonValue(data, columnFilter['column'])
            matchFilter.push(dataColumn.toString().toLowerCase().includes(filter.toLowerCase()));
        } 
        return matchFilter.some(Boolean)
    } 
    else {
        return false
    }
}

export function getJsonValue(data: any, columnName: string, type?: undefined, separator?: undefined) {
    let dataColumn
    let arrayColumn = columnName.split('|')
    if (arrayColumn.length > 1) {
        for (const column of arrayColumn) {
            if (separator) {
                dataColumn += dataColumn == undefined?getDataColumn(data, column): `${separator}${getDataColumn(data, column)}`
            }
            else {
                dataColumn += getDataColumn(data, column)
            }
        }
    }
    else {
        dataColumn = getDataColumn(data, columnName)
    }
    return formatDataColumn(dataColumn, type)
}

function getDataColumn(data: any, columnName: string) {
    let dataColumn
    let arr = columnName.split(".")
    if (arr.length > 1) {
      dataColumn = data[arr.shift()?? 'default']
      if (dataColumn) {
        if (Array.isArray(dataColumn)) {
          dataColumn = dataColumn[0]
        }
        while (arr.length) {
          dataColumn = dataColumn[arr.shift()?? 'default'];
          if (Array.isArray(dataColumn)) {
            dataColumn = dataColumn[0]
          }
        }
      }
    }
    else {
      dataColumn = data[columnName]
      if (Array.isArray(dataColumn)) {
        dataColumn = dataColumn[0]
      }
    }
    dataColumn = dataColumn === null ? '' : dataColumn
    dataColumn = dataColumn === undefined ? '' : dataColumn

    return dataColumn
}

function formatDataColumn(data: any, type: any) {    
    let dataColumn = data
    if (type) {
        if (data) {
            switch(type) {
                case 'Date':
                    dataColumn = formatDate(data.toDate())
                    break
    
                case 'Datetime':
                    if (data) {
                        dataColumn = formatDatetime(data.toDate())
                    }
                    break
    
                case 'Time':
                    dataColumn = formatTime(data.toDate())
                    break
    
                case 'Price':
                    dataColumn = formatPrice(data)
                    break
    
                case 'Qty':
                    dataColumn = formatQty(data)
                    break
    
                case 'Boolean':
                    dataColumn = data == 'true'? 'Si': 'No'
                    break
            }
        }
    }

    return dataColumn
}

export function formatCurrency(value: any, currency: any) {
    return `${currency} ${value}`
}

export function formatPrice(value: string) {
    return Number.parseFloat(value).toFixed(2)
}

export function formatQty(value: string) {
    return Number.parseFloat(value).toFixed(2)
}

export function formatDate(value: any) {
    return moment(value).tz('America/Lima').format('DD/MM/YYYY')
}

export function formatDatetime(value: any) {
    return moment(value).tz('America/Lima').format('DD/MM/YYYY HH:mm:ss')
}

export function formatTime(value: any) {
    return moment(value).tz('America/Lima').format('HH:mm:ss')
}
