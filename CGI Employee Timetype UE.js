/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

modules = 
[
    'N/log',
    'N/search',
    'N/record',
];

define(modules, main)

function main(log, search, record){

    function beforeSubmit(context){
        if(context.type == context.UserEventType.CREATE){
            log.debug('SCRIPT TRIGGERS on before submit')
            Rec = context.newRecord
            ttId = Rec.getValue({fieldId: 'custrecord_cgi_hr_emp_ttype_ttype'})
            ttName = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: ttId, columns: ['name']}).name
            ettName = Rec.getValue({fieldId: 'name'})
            if(ettName == ttName){
                log.debug('RETURN')
                return
            } else {
                log.debug('SETVALUE')
                Rec.setValue({fieldId: 'name', value: ttName})
            }
        }
}

    return {		
        beforeSubmit : beforeSubmit
    }    
}
		

    



