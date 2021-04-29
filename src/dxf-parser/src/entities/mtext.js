
import * as helpers from '../ParseHelpers'

export default function EntityParser() {}

EntityParser.ForEntityName = 'MTEXT';

EntityParser.prototype.parseEntity = function(scanner, curr) {
    var entity = { type: curr.value ,text:''};
		curr = scanner.next();


    while(curr !== 'EOF') {
        if(curr.code === 0) break;

        switch(curr.code) {
            case 3:
                entity.text += curr.value
                break;
            case 1:
                entity.text+=~curr.value.indexOf('|')?curr.value.split(';')[1]:curr.value
                break;
            case 10:
                entity.position = helpers.parsePoint(scanner);
                break;
            case 40:
                //Note: this is the text height
                entity.height = curr.value;
                break;
            case 41:
                entity.width = curr.value;
                break;
            case 50:
                entity.rotation = curr.value;
                break;
            case 71:
                entity.attachmentPoint = curr.value;
                break;
            case 72:
                entity.drawingDirection = curr.value;
                break;
            default:
                helpers.checkCommonEntityProperties(entity, curr);
                break;
        }
        curr = scanner.next();
    }


    return entity;
};
