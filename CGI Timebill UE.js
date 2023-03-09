/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */

 define(['N/error', 'N/file', 'N/record', 'N/render','N/log', 'N/search', 'N/runtime', 'N/email', '/SuiteScripts/CGI/Libraries/cgi-segments.js'],
 function (error, file, record, render, log, search, runtime, email, cgi) {

   function checkTimeTypeGroup(tType){
      appStatus = 2
      timeGroupId = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: tType, columns:['custrecord_cgi_hr_ttype_ttgroup']}).custrecord_cgi_hr_ttype_ttgroup[0].value
      timeGroupName = search.lookupFields({type: 'customrecord_cgi_hr_ttgroup', id: timeGroupId, columns: 'name'}).name
     
     log.debug("tie group name",timeGroupName )
      if(timeGroupName==="Ordinær arbeidstid"){
         appStatus = 3;
      }
   return appStatus   
   }

    function beforeLoad(context){
        log.debug('Before Load triggers')
        Rec = context.newRecord
        Rec.setValue({fieldId: 'item', value: 677})
    }

    function beforeSubmit(context){
    if(context.type == context.UserEventType.CREATE){
        Rec = context.newRecord
        emp = Rec.getValue({fieldId: 'employee'})
        task = Rec.getValue({fieldId: 'casetaskevent'})
        tType = Rec.getValue({fieldId: 'custcol_cgi_hr_ttype'})
        itemIn = Rec.getValue({fieldId: 'item'})
        approvalcheck= Rec.getValue({fieldId:"supervisorapproval"})
      
      log.debug("check",approvalcheck )
      if(tType){
         ApprovalStatus = checkTimeTypeGroup(tType)
      } else ApprovalStatus = 2
            
      log.debug("approvalstatus",ApprovalStatus )
      
      taskName = search.lookupFields({type: 'task', id: task, columns: 'title'}).title
      log.debug('TASKDATA', 'ID: ' + task + 'Name: ' + taskName)

      if(taskName == null || taskName == '' ||taskName == undefined){
         tRec = record.load({type: 'projecttask', id: task})
         taskName = tRec.getValue({fieldId: 'title'})
         log.debug('PRJTASK', 'ID: ' + task + 'Name: ' + taskName)
         bArea = search.lookupFields({type: 'employee', id: emp, columns: ['custentity_cgi_prj_emp_class']}).custentity_cgi_prj_emp_class[0].value
         wbs = tRec.getValue({fieldId: 'custevent_cgi_prj_task_time'})
         prj = tRec.getValue({fieldId: 'company'})
         pCode = cgi.getProjectCode(prj)
         item = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: tType, columns: ['custrecord_cgi_hr_ttype_item']}).custrecord_cgi_hr_ttype_item[0].value
         costmulti = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: tType, columns: ['cseg_cgi_costmulti']}).cseg_cgi_costmulti[0].value
         cText = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: tType, columns: ['cseg_cgi_costmulti']}).cseg_cgi_costmulti[0].text
         try{
            log.debug('PRJTaskValues', 'ActivityCode : ' + wbs + 'projectCode ' + pCode + ', TtItem : ' + item + 'CostMultiText: ' + cText + ', CostMultipl : ' + costmulti)
            Rec.setValue({fieldId: 'item', value: item})
            Rec.setValue({fieldId: 'class', value: bArea})
            Rec.setValue({fieldId: 'cseg1', value: pCode})
            if(wbs){
               Rec.setValue({fieldId: 'cseg_paactivitycode', value: wbs})
            }
            Rec.setValue({fieldId: 'cseg_cgi_costmulti', value: costmulti})
            Rec.setValue({fieldId:"approvalstatus", value: ApprovalStatus})
            if(ApprovalStatus === 3){
            Rec.setValue({fieldId:"supervisorapproval", value:true})
            }
         } catch(e){
            log.debug('ERROR', e.message)
         }

      } else {
         log.debug('CRMTASK', 'ID: ' + task + 'Name: ' + taskName)
         bArea = search.lookupFields({type: 'employee', id: emp, columns: ['custentity_cgi_prj_emp_class']}).custentity_cgi_prj_emp_class[0].value
         //wbs = search.lookupFields({type: 'projecttask', id: task, columns:['custevent_cgi_prj_task_time']}).custevent_cgi_prj_task_time[0].value
         prj = search.lookupFields({type: 'task', id: task, columns:['company']}).company[0].value
         pCode = cgi.getProjectCode(prj)
         item = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: tType, columns: ['custrecord_cgi_hr_ttype_item']}).custrecord_cgi_hr_ttype_item[0].value
         costmulti = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: tType, columns: ['cseg_cgi_costmulti']}).cseg_cgi_costmulti[0].value
         cText = search.lookupFields({type: 'customrecord_cgi_hr_ttype', id: tType, columns: ['cseg_cgi_costmulti']}).cseg_cgi_costmulti[0].text
         try{
            log.debug('CRMTaskValues', 'ProjectCode: ' + pCode + 'TtItem : ' + item + 'CostMultiText: ' + cText + ', CostMultipl : ' + costmulti)
            Rec.setValue({fieldId: 'item', value: item})
            Rec.setValue({fieldId: 'class', value: bArea})
            Rec.setValue({fieldId: 'cseg1', value: pCode})
            Rec.setValue({fieldId: 'cseg_cgi_costmulti', value: costmulti})
            Rec.setValue({fieldId:"approvalstatus", value: ApprovalStatus})
            if(ApprovalStatus === 3){
            Rec.setValue({fieldId:"supervisorapproval", value:true})
            }
         } catch(e){
            log.debug('ERROR', e.message)
         }
      }  
   }
}

function afterSubmit(context){
   if(context.type == context.UserEventType.CREATE){   
      Rec = context.newRecord
      ttypeId = Rec.getValue({fieldId: 'custcol_cgi_hr_ttype'})
      if(ttypeId){
         log.debug('RETURN', 'TIMETYPE HAS VALUE')
         return
      } else {
         log.debug('SETVALUE', 'TIMETYPE HAS NOT VALUE')
         ettypeId = Rec.getValue({fieldId: 'custcol_cgi_hr_emp_ttype'})
         ettSearch = search.create({type: 'customrecord_cgi_hr_emp_ttype', filters: [['internalid', 'anyof', ettypeId]], columns:['custrecord_cgi_hr_emp_ttype_ttype']})
         if(ettSearch.runPaged().count > 0){
            ettRes = ettSearch.run().getRange({start: 0, end: 1})
            newTTypeId = ettRes[0].getValue({name: 'custrecord_cgi_hr_emp_ttype_ttype'})
            record.submitFields({type: 'timebill', id: Rec.id, values:{'custcol_cgi_hr_emp_ttype' : newTTypeId}})  
         }
      }
   }
}
 return {
    beforeLoad : beforeLoad,
    beforeSubmit: beforeSubmit,
    afterSubmit :afterSubmit
 };
 })
