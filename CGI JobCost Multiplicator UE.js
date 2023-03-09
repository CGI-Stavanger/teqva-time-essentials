/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

 define(['N/error', 'N/record', 'N/render','N/log', 'N/search', 'N/runtime', 'N/email'],
 function (error, record, render, log, search, runtime, email) {



    function afterSubmit(context){
        Rec = context.newRecord
        posted = Rec.getValue({fieldId:'posted'})
        if(context.type == 'post' && posted == true){
            transaction = Rec.getValue({fieldId: 'transactionid'})
            log.debug('Posted', 'Time is now posted on transaction id: ' + transaction)

            trans = record.load({type: 'journalentry', id: transaction})
            jLines = trans.getLineCount({sublistId: 'line'})
            log.debug('From timebill - process ' + jLines + ' lines')
            for(z=0 ; z<jLines ; z++){
                  multi = trans.getSublistText({sublistId: 'line', fieldId: 'cseg_cgi_costmulti', line: z}).replace(',','.')
                  multiplicator = Number(multi)
                  log.debug('Line : ' + (z+1) + ' Multiplicator is : ' + multiplicator)
                  if(multiplicator > 1){
                     debit = trans.getSublistValue({sublistId: 'line', fieldId: 'debit', line: z})
                     credit = trans.getSublistValue({sublistId: 'line', fieldId: 'credit', line: z})
                     newDebit = debit * multiplicator
                     newCredit = credit * multiplicator
                     log.debug('Line','Line : ' + z + ' | Debit : ' + debit + ' Credit : ' + credit + ' | NewDebit : ' + newDebit + ' Credit : ' + newCredit)
                     trans.setSublistValue({sublistId: 'line', fieldId: 'debit', value: newDebit, line: z})
                     trans.setSublistValue({sublistId: 'line', fieldId: 'credit', value: newCredit, line: z})
                     trans.setSublistText({sublistId: 'line', fieldId: 'cseg_cgi_costmulti', text: '1', line: z}) 
               }
            }
            trans.save()  

        }    
    }
        

 return {
    afterSubmit: afterSubmit
 };
 })
