/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

 modules = 
[
    'N/error', 'N/file', 'N/format','N/record', 'N/render','N/log', 'N/search', 
    'N/runtime', 'N/email', '/SuiteScripts/CGI/Libraries/cgi-segments.js'
];

define(modules, main)

function main(error, file, format, record, render, log, search, runtime, email, cgi){

    function beforeSubmit(context){
        Rec = context.newRecord
        timeBill = {}
        timeBill.emp = Rec.getValue({fieldId: 'employee'})

        // Get project for absence and employee department
        empSearch = search.create({type: 'employee', filters:[['internalid','anyof',timeBill.emp]], columns: ['custentity_cgi_hr_absence_prj', 'department','custentity_cgi_hr_wagree']})
        if(empSearch.runPaged().count > 0){
            empRes = empSearch.run().getRange({start: 0, end: 1})
            timeBill.prjId = empRes[0].getValue({name: 'custentity_cgi_hr_absence_prj'})
            timeBill.depId = empRes[0].getValue({name: 'department'})
            timeBill.wAgree = empRes[0].getValue({name: 'custentity_cgi_hr_wagree'})
        } else {
            timeBill.prjId = ''
            timeBill.depId = ''
            timeBill.wAgree = ''
        }

        //get timetype from Evolution Absence Code
        HRCode = Rec.getValue({fieldId: 'custcol_cgi_hr_absence_code'})
        ttSearch = search.create({
            type: 'customrecord_cgi_hr_emp_ttype', 
            filters: [['custrecord_cgi_hr_emp_ttype_emp', 'anyof', timeBill.emp], 'AND', ['custrecord_cgi_hr_emp_ttype_hrcode', 'is', HRCode]], 
            columns: ['name','custrecord_cgi_hr_emp_ttype_ttype']})
        if(ttSearch.runPaged().count > 0){
            log.debug('TIMETYPE', 'Count: ' + ttSearch.runPaged().count)
            ttRes = ttSearch.run().getRange({start: 0, end: 1})
            log.debug('RESULTSET', JSON.stringify(ttRes))
            timeBill.tTypeId = ttRes[0].getValue({name: 'custrecord_cgi_hr_emp_ttype_ttype'})
        } else {
            timeBill.tTypeId = ''
        }
        log.debug('TIMETYPE', 'HRCode: ' + HRCode + ', TimeType: ' + timeBill.tTypeId)

        //Set other default values
        timeBill.duration  = Rec.getValue({fieldId: 'hours'})
        timeBill.appStatus = 2
        timeBill.serviceItem = 68137

        //Get formatted date 
        date = Rec.getValue({fieldId: 'trandate'})
        timeBill.pDate = format.parse({value: date, type: format.Type.DATE})
        //timeBill.fDate = format.format({value: pDate, type: format.Type.DATE })

        log.debug('TIMEBILL', JSON.stringify(timeBill))

        Rec.setValue({fieldId: 'employee', value: timeBill.emp})
        Rec.setValue({fieldId: 'trandate', value: timeBill.pDate})
        Rec.setValue({fieldId: 'customer', value: timeBill.prjId})
        Rec.setValue({fieldId: 'custcol_cgi_hr_ttype', value: timeBill.tTypeId})
        Rec.setValue({fieldId: 'hours', value: timeBill.duration})
        Rec.setValue({fieldId: 'approvalstatus', value: timeBill.appStatus})
        //Rec.setValue({fieldId: 'serviceitem', value: timeBill.serviceItem})
        Rec.setValue({fieldId: 'isbillable', value: false})

        Rec.setValue({fieldId: 'department', value: timeBill.depId})
  
    }

return {
    beforeSubmit: beforeSubmit
};
}
