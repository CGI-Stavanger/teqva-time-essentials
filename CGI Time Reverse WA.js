/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */

define(['N/search','N/record','N/runtime', 'N/query', 'N/format'], function(search, record, runtime, query, format){

        function onAction(scriptContext){
            cRec = scriptContext.newRecord;
            //idField = curRec.getValue({fieldId: 'id'})
            oTimeId = cRec.id
            rHrs = (cRec.getValue({fieldId: 'hours'})*-1)
            log.debug('Timebill Id : ' + oTimeId)
            today = new Date()
            //formatDate = format.parse({value: trandate, type: format.Type.DATE})

            try{
                rTime = record.copy({
                    type:record.Type.TIME_BILL,
                    id: oTimeId,
                    isDynamic: true
                })

            } catch (e) {
                log.debug('Record Creation Error', e)
            }
                log.debug('Record was copied as ' + rTime)
                rTime.setValue({fieldId: 'hours', value: rHrs})
                log.debug('Hours Set: ' + rHrs)
                rTime.setValue({fieldId: 'custcol_cgi_pr_time_reversalof', value: oTimeId})
                log.debug('OldTime Set: ' + oTimeId)
                //rTime.setValue({fieldId: 'custcol_cgi_payroll_prtransid_ontime', value: ''})
                //rTime.setValue({fieldId: 'custcol_cs_time_posting_transaction', value: ''})
              //  rTime.setValue({fieldId: 'custrecord_cgi_prtrans_prperiod', value: ''})
                
                
                newTime = rTime.save()
                log.debug('newTime Set: ' + newTime)

           

            cRec.setValue({fieldId: 'custcol_cgi_pr_time_reversedby', value: newTime})
            log.debug('New record is : ' + newTime)


        }         
    return{
 
        onAction : onAction
   
    }
});