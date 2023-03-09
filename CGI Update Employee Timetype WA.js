/**
 *@NApiVersion 2.0
 *@NScriptType WorkflowActionScript
 */

 define(['N/error', 'N/record', 'N/log', 'N/search', 'N/task','N/redirect','N/runtime', '/SuiteScripts/CGI/Libraries/cgi-segments.js', '/SuiteScripts/CGI/Libraries/cgi-optionorder.js'],
 function (error, record, log, search, task, redirect, runtime, cgi, option) {

    function onAction(scriptContext){
    log.debug('Script triggers')
        inactive = false
        script = runtime.getCurrentScript()
        empRec = scriptContext.newRecord;
        empId = empRec.getValue({fieldId: 'id'})
        wagree = empRec.getValue({fieldId: 'custentity_cgi_hr_wagree'})
        log.debug('AGREEMENTS', 'WorkAgreement: ' + wagree + ', EmpId: ' + empId)

        //Delete Or InActivate Existing
        ettSearch = search.create({type: 'customrecord_cgi_hr_emp_ttype', filters: [['custrecord_cgi_hr_emp_ttype_emp', 'anyof', empId]], columns:['internalid']})
        if(ettSearch.runPaged().count > 0){
            ettSearch.run().each(function(result){
                ettypeId = result.id
                try{
                    record.delete({type: 'customrecord_cgi_hr_emp_ttype', id: ettypeId})
                    inactive = false
                } catch(e){
                    errorMsg = JSON.stringify(e.name)
                    log.debug('DELETE', 'Error Message is: ' + errorMsg + ', on Id: ' + ettypeId)
                    if(errorMsg == '"THIS_RECORD_CANNOT_BE_DELETED_BECAUSE_IT_HAS_DEPENDENT_RECORDS"'){
                        log.debug('INACTIVATE', 'Try to inactivate instead')
                        try{
                            record.submitFields({type: 'customrecord_cgi_hr_emp_ttype', id: ettypeId, values: {'isinactive' : true}})
                        } catch(e){
                            log.error('INACTIVATE', 'Could Not Inactivate: ' + JSON.stringify(e))
                        }
                    }
                }
            return true
            })
        }

        //Add New
        ttSearch = search.create({
            type: 'customrecord_cgi_hr_ttype', 
            filters: [['custrecord_cgi_hr_ttype_wagree','anyof', wagree]], 
            columns:['name', 'custrecord_cgi_hr_ttype_ttgroup', 'custrecord_cgi_hr_ttype_absence_code']
        })
        if(ttSearch.runPaged().count > 0){
            ttSearch.run().each(function(result){
                ttypeId = result.id
                ttypeName = result.getValue({name: 'name'})
                ttypeGroup = result.getValue({name: 'custrecord_cgi_hr_ttype_ttgroup'})
                ttHRCode = result.getValue({name: 'custrecord_cgi_hr_ttype_absence_code'})
                ettRec = record.create({type: 'customrecord_cgi_hr_emp_ttype'})
                ettRec.setValue({fieldId: 'custrecord_cgi_hr_emp_ttype_emp', value: empId}) 
                ettRec.setValue({fieldId: 'custrecord_cgi_hr_emp_ttype_ttype', value: ttypeId})
                ettRec.setValue({fieldId: 'custrecord_cgi_hr_emp_ttype_ttgroup', value: ttypeGroup})
                ettRec.setValue({fieldId: 'custrecord_cgi_hr_emp_ttype_hrcode', value: ttHRCode})
                ettRec.setValue({fieldId: 'name', value: ttypeName})
                try{
                    ettRec.save()
                } catch(e){
                    log.error('SAVE_ERROR', 'ErrorMsg: ' + JSON.stringify(e))
                }
            return true
            })
        }
    }

return {
    onAction : onAction
}

});

 