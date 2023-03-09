/**
 * /CGI/libraries/cgi-projectcode
 * @ApiVersion 2.0
 * @ModuleScope Public
 */

 define(
    ['N/search','N/log', 'N/record'], 
    function(search, log, record) {

        function getProjectCode(projectId){
            pRec = record.load({type: 'job', id: projectId})
            pName = pRec.getValue({fieldId: 'entitytitle'})
            shortName = pRec.getValue({fieldId: 'nameorig'})
            codeSearch = search.create({type: 'customrecord_cseg1', filters: [['name', 'is', shortName]], columns: 'name'})
            pCodeCount = codeSearch.runPaged().count
            if(pCodeCount < 1){
                newPcode = record.create({type: 'customrecord_cseg1'})
                newPcode.setValue({fieldId: 'name', value: shortName})
                try{
                    pCodeId = newPcode.save()
                    pRec.setValue({fieldId: 'cseg1', value: pCodeId})
                    pRec.save()
                } catch (e){
                    log.debug('Error', e.message)
                }
            } else {
                pCodeId = codeSearch.run().getRange({start: 0, end: 1})[0].id
            }
        return pCodeId
        }

        return {
            getProjectCode : getProjectCode
        };     
    });