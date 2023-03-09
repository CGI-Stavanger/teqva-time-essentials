 /**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define(['N/currentRecord',"N/log", 'N/search', 'N/ui/dialog','N/format','N/error'], function (currentRecord, log, search, dialog,format,error) {
  function reverseString(datevalue) {

    var parsedtrandate = format.format({value: datevalue, type: format.Type.DATE}) 

    var str = parsedtrandate.toString();


    return str; 
}
 
  function beforeLoad(context) {
  }
  function beforeSubmit(context) {
      var Rec = context.newRecord;
      var trandate = Rec.getValue({fieldId:'trandate'});
      var customer = Rec.getValue({fieldId:'customer'});
      log.debug("customer",customer)
    try{
      var avdeling = search.lookupFields({type: 'job', id: customer, columns: 'custentity_cgi_prj_prjdep'}).custentity_cgi_prj_prjdep[0].value
      log.debug("avdeling",avdeling)
      Rec.setValue({fieldId: 'department',
      value: avdeling,
      ignoreFieldChange: true});
    }catch(e){
      log.debug("e",e)
    }

      var todaydate = new Date();
     
      
     
    
    
    var reversedtodaydate = reverseString(todaydate);

    log.debug("reversedtodaydate",reversedtodaydate)
    
    
    var daytoday = reversedtodaydate.substring(0,2)
    
    var monthtoday = parseInt(reversedtodaydate.substring(3,5))
    
    var yeartodaydate = parseInt(reversedtodaydate.substring(6,10))
    
    var daymaxback = daytoday - 7;

    log.debug("daytoday", daytoday)
    log.debug("monthtoday", monthtoday)
    log.debug("yeartodaydate", yeartodaydate)

    var yearmax = yeartodaydate;

    if(daymaxback<0){
       var monthmax = monthtoday-1;
       if(monthmax == 1 || monthmax == 3 || monthmax == 5 || monthmax == 7 || monthmax == 8 || monthmax == 10 || monthmax == 12){
          var daymin = 31 + daymaxback;
         }else if(monthmax == 2){
          var daymin = 28 + daymaxback;
         }else if(monthmax == 4 || monthmax == 6 || monthmax == 9 || monthmax == 11){
          var daymin = 30 + daymaxback;
         }else if(monthmax < 0){
          yearmax = yeartodaydate -1;
         }
      
    }else{
        var monthmax = monthtoday;
         
      var daymin = daymaxback;

    }
    
    
   
    
       var datemaxstring = daymin + "." + monthmax + "." + yearmax
       var datemax = format.parse({value:datemaxstring, type: format.Type.DATE})

       log.debug("daymaxback", daymaxback)
    
      
    
        
      log.debug("trandate",trandate)
      log.debug("datemax",datemax)
    if(trandate > datemax){
      log.debug("here true")
     return true;
    
     }
    else if(trandate < datemax){
      log.debug("here false")
       var myCustomError = error.create({
              name: 'DATE IS OLDER THAN 7 DAYS',
              message: 'DATE CANNOT BE LONGER THAN 7 DAYS',
              notifyOff: false
          });

          log.error('Error: ' + myCustomError.name , myCustomError.message);
          throw myCustomError
      return false;
        
     }
     
  }
  function afterSubmit(context) {
   /* var Rec = context.newRecord;
      var customer = Rec.getValue({fieldId:'customer'});
      log.debug("customer",customer)
    try{
      var avdeling = search.lookupFields({type: 'job', id: customer, columns: 'custentity_cgi_prj_prjdep'}).custentity_cgi_prj_prjdep[0].value
      log.debug("avdeling",avdeling)
      Rec.setValue({fieldId: 'department',
      value: avdeling,
      ignoreFieldChange: true});
    }catch(e){
      log.debug("e",e)
    }*/
   
  }
  return {
      
      beforeSubmit: beforeSubmit
  };
}); 