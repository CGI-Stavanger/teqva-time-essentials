/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

 define(['N/error', 'N/record', 'N/render','N/log', 'N/search', 'N/runtime', 'N/email'],
 function (error, record, render, log, search, runtime, email) {
 
     function beforeSubmit(context){
        Rec = context.newRecord
        isNamed = false
        recName = Rec.getValue({fieldId: 'name'})
        recNameCheck = recName.slice(0,3)

        ttAbbrId = Rec.getValue({fieldId: 'custrecord_cgi_hr_ttype_ttgroup'})
        sAbbr = search.lookupFields({type: 'customrecord_cgi_hr_ttgroup', id: ttAbbrId, columns: 'custrecord_cgi_hr_ttgroup_abbr'})
        ttAbbr = sAbbr.custrecord_cgi_hr_ttgroup_abbr

        typeAbbr = search.create({type: 'customrecord_cgi_hr_ttgroup', columns: 'custrecord_cgi_hr_ttgroup_abbr'})
        abbRes = typeAbbr.run().each(function(result){
        abbr = result.getValue({name:'custrecord_cgi_hr_ttgroup_abbr'}).slice(0,3)

        if(recNameCheck == abbr){
            isNamed = true
        }

        //log.debug('Values', 'Name : ' + recName + ' Abbr : ' + abbr + ' isNamed : ' + isNamed)
        return true
        })

        if (isNamed == false){
            Rec.setValue({fieldId: 'name', value: ttAbbr + ' ' + recName})
        }

}
 return {
    beforeSubmit: beforeSubmit
 };
 })
