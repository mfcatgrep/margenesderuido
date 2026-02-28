"use strict"
/* Martin Ferreya*/

let focusConfigured=false;
let previousGateInput;
let previousGateOutput;


//This will not work with negative numbers
function precisionSubstraction(minuend,substrahend)
{

    let negative=false;
    let minuendString=minuend.toString();
    let substrahendString=substrahend.toString();

    if(minuendString.indexOf(".")==-1 && substrahendString.indexOf(".")==-1)
        return minuend-substrahend;

    if(minuend<substrahend)
    {
        let aux=minuend;
        minuend=substrahend;
        substrahend=aux;
        aux=minuendString;
        minuendString=substrahendString;
        substrahendString=aux;
        negative=true;
    }

    let minuendIntegerLength=minuendString.split(".")[0].length;
    let substrahendIntegerLength=substrahendString.split(".")[0].length;
    let result="";

     if(minuendString.indexOf(".")==-1)
        minuendString+=".00";
     else
     {
        if(minuendString.split(".")[1].length == 1)
            minuendString+="0";
     }

     if(substrahendString.indexOf(".")==-1)
        substrahendString+=".00";
     else
     {
        if(substrahendString.split(".")[1].length == 1)
            substrahendString+="0";
     }

     if( minuendIntegerLength > substrahendIntegerLength)
     {
         for(let i=0;i<  minuendIntegerLength - substrahendIntegerLength ; i++)
           substrahendString="0"+substrahendString;
     }
     else
     {
        if(substrahendIntegerLength != minuendIntegerLength)
            for(let i=0;i<substrahendIntegerLength-minuendIntegerLength; i++)
                minuendString="0"+minuendString;

     }

     substrahend=substrahendString.split(".")[0]+substrahendString.split(".")[1];
     minuend=minuendString.split(".")[0]+minuendString.split(".")[1];

     let substrahendVector=[];
     let minuendVector=[];


     for(let i=0;i<substrahend.length;i++)
     {
         substrahendVector.push(substrahend.charCodeAt(i)-48);
         minuendVector.push(minuend.charCodeAt(i)-48);
     }


     for(let i=substrahendVector.length-1;i>=0;i--)
     {
        if(minuendVector[i]>=substrahendVector[i])
            result=(minuendVector[i]-substrahendVector[i]).toString()+result;
        else
        {

            let j=i;

            minuendVector.splice(i,1,minuendVector[i]+10);

            j--;
            while(minuendVector[j]==0 && j>0)
            {
                minuendVector.splice(j,1,minuendVector[j]+9)
                j--;

            }

            minuendVector.splice(j,1,minuendVector[j]-1)
            result=(minuendVector[i]-substrahendVector[i]).toString()+result;
        }

     }

     if(negative==true)
         result="-"+result;

    return parseFloat(result.substring(0,result.length-2)+"."+result.substring(result.length-2,result.length));
}

function findExtrems(inputDictionary)
{
    let start=true;
    let higher;
    let lowest;

    for(let key in inputDictionary)
    {
        if(start === true)
        {
            higher=inputDictionary[key];
            lowest=inputDictionary[key];
            start=false;
        }
        else
        {
            if(higher<inputDictionary[key])
                higher=inputDictionary[key];
            if(lowest>inputDictionary[key])
                lowest=inputDictionary[key];
        }
    }

    let result={};
    result["higher"]=higher;
    result["lowest"]=lowest;
    result["difference"]=higher-lowest;
    return result;
}


class Gate
{
    #VHMaxVLabel="";
    #VHMinVLabel="";
    #VLMaxVLabel="";
    #VLMinVLabel="";

    #VHMaxValue=0;
    #VHMinValue=0;
    #VLMaxValue=0;
    #VLMinValue=0;

    #HighPadding="";
    #HighSegment="";
    #MediumSegment="";
    #LowSegment="";
    #LowPadding="";

    #isInput

    constructor(VHMaxVLabel,VHMinVLabel,VLMaxVLabel,VLMinVLabel,VHMaxValue,VHMinValue,VLMaxValue,VLMinValue,HighPadding,HighSegment,MediumSegment,LowSegment,LowPadding,isInput)
    {
        this.VHMaxVLabel=VHMaxVLabel;
        this.VHMinVLabel=VHMinVLabel;
        this.VLMaxVLabel=VLMaxVLabel;
        this.VLMinVLabel=VLMinVLabel;

        this.VHMaxValue=VHMaxValue;
        this.VHMinValue=VHMinValue;
        this.VLMaxValue=VLMaxValue;
        this.VLMinValue=VLMinValue;

        this.HighPadding=HighPadding;
        this.HighSegment=HighSegment;
        this.MediumSegment=MediumSegment;
        this.LowSegment=LowSegment;
        this.LowPadding=LowPadding;

        this.isInput=isInput;
    }

    draw(extremes)
    {
        //Drawing bands
        let highPaddingValue=extremes["higher"]-this.VHMaxValue;
        let highPaddingBand=(highPaddingValue*100)/extremes["difference"];
        let highBand=((this.VHMaxValue-this.VHMinValue)*100)/extremes["difference"];
        let mediumBand=((this.VHMinValue-this.VLMaxValue)*100)/extremes["difference"];
        let lowBand=((this.VLMaxValue-this.VLMinValue)*100)/extremes["difference"];
        let lowPaddingValue=this.VLMinValue-extremes["lowest"];
        let lowPaddingBand=(lowPaddingValue*100)/extremes["difference"];

        this.HighPadding.style.height=highPaddingBand+"%";
        this.HighSegment.style.height=highBand+"%";
        this.MediumSegment.style.height=mediumBand+"%";
        this.LowSegment.style.height=lowBand+"%";
        this.LowPadding.style.height=lowPaddingValue+"%";

        let gateDirection="O";

        //Writing labels
        if (this.isInput == true)
            gateDirection="I";

        this.VHMaxVLabel.textContent="V"+gateDirection+"HMax: "+this.VHMaxValue;
        this.VHMinVLabel.textContent="V"+gateDirection+"HMin: "+this.VHMinValue;
        this.VLMaxVLabel.textContent="V"+gateDirection+"LMax: "+this.VLMaxValue;
        this.VLMinVLabel.textContent="V"+gateDirection+"LMin: "+this.VLMinValue;

    }

    clear()
    {

        this.HighPadding.style.height=0;
        this.HighSegment.style.height=0;
        this.MediumSegment.style.height=0;
        this.LowSegment.style.height=0;
        this.LowPadding.style.height=0;

        this.VHMaxVLabel.textContent="";
        this.VHMinVLabel.textContent="";
        this.VLMaxVLabel.textContent="";
        this.VLMinVLabel.textContent="";
    }

    reset()
    {

        this.HighPadding.style.height=0;
        this.HighSegment.style.height=50+"%";
        this.MediumSegment.style.height=30+"%";
        this.LowSegment.style.height=20+"%";
        this.LowPadding.style.height=0;

        let gateDirection="O";

        if (this.isInput == true)
            gateDirection="I";

        this.VHMaxVLabel.textContent="V"+gateDirection+"HMax: ";
        this.VHMinVLabel.textContent="V"+gateDirection+"HMin: ";
        this.VLMaxVLabel.textContent="V"+gateDirection+"LMax: ";
        this.VLMinVLabel.textContent="V"+gateDirection+"LMin: ";

    }


    getVHMaxValue()
    {
        return this.VHMaxValue;
    }

    getVHMinValue()
    {
        return this.VHMinValue;
    }

    getVLMaxValue()
    {
        return this.VLMaxValue;
    }

    getVLMinValue()
    {
        return this.VLMinValue;
    }

}


class Explanation
{

    #title
    #explanation

    constructor()
    {
        this.compatibles=false;
        this.explanation=""
    }


    setTitle(title)
    {
        this.title=title
    }

    setExplanation(explanation)
    {
        this.explanation=explanation;
    }

    addExplanation(explanation)
    {
        this.explanation=this.explanation+explanation;
    }

    getTitle()
    {
        return this.title;
    }

    getExplanation()
    {
        return this.explanation;
    }

    setCompatible(compatible)
    {
        this.compatibles=compatible;
    }


    getValid()
    {
        return this.compatibles;
    }

}

class NoiseMargin
{
    #outputGate
    #inputGate


    #nmHighValue
    #nmLowValue

    #nmHighPadding
    #nmHighBand
    #nmMediumBand
    #nmLowBand
    #nmLowPadding

    #nmHighLabel
    #nmLowLabel

    constructor(outputGate,inputGate,nmHighPadding,nmHighBand,nmMediumBand,nmLowBand,nmLowPadding,nmHighLabel,nmLowLabel)
    {
        this.outputGate=outputGate;
        this.inputGate=inputGate;

        this.nmHighPadding=nmHighPadding;
        this.nmHighBand=nmHighBand;
        this.nmMediumBand=nmMediumBand;
        this.nmLowBand=nmLowBand;
        this.nmLowPadding=nmLowPadding;

        this.nmHighValue= precisionSubstraction(this.outputGate.getVHMinValue(),this.inputGate.getVHMinValue());
        this.nmLowValue=  precisionSubstraction(this.inputGate.getVLMaxValue(),this.outputGate.getVLMaxValue());

        this.nmHighLabel=nmHighLabel;
        this.nmLowLabel=nmLowLabel;
    }


    clear()
    {
        this.nmHighPadding.style.height=0;
        this.nmHighBand.style.height=0;
        this.nmMediumBand.style.height=0;
        this.nmLowBand.style.height=0;
        this.nmLowPadding.style.height=0;
        this.nmHighLabel.textContent=""
        this.nmLowLabel.textContent="";

    }

    draw(extremes)
    {
        this.clear();

        //Drawing bands
        if(this.outputGate.getVLMaxValue()>=this.outputGate.getVHMinValue() || this.inputGate.getVLMaxValue()>=this.inputGate.getVHMinValue())
            return;



        let lowTop=this.inputGate.getVLMaxValue();
        let highTop=this.inputGate.getVHMinValue();
        let highLow=this.outputGate.getVHMinValue();

        if(this.outputGate.getVLMaxValue() > this.inputGate.getVLMaxValue())
        {
            lowTop=this.outputGate.getVLMaxValue();
            this.nmLowBand.style.background="var(--wrongNMColor)";
        }
        else
            this.nmLowBand.style.background="var(--rightNMColor)";


        if(this.outputGate.getVHMinValue() > this.inputGate.getVHMinValue())
        {
            highTop=this.outputGate.getVHMinValue();
            highLow=this.inputGate.getVHMinValue();
            this.nmHighBand.style.background="var(--rightNMColor)";
        }
        else
            this.nmHighBand.style.background="var(--wrongNMColor)";



        let nmHighPaddingValue=((extremes["higher"]-highTop)*100)/extremes["difference"];
        let nmHighBandValue = (Math.abs(this.nmHighValue)*100)/extremes["difference"];;
        let nmMediumBandValue=((highLow-lowTop)*100)/extremes["difference"];
        let nmLowBandValue=(Math.abs(this.nmLowValue)*100)/extremes["difference"];;
        let nmLowPaddingBandValue=100-nmHighPaddingValue-nmHighBandValue-nmMediumBandValue-nmLowBandValue;


        this.nmHighPadding.style.height=nmHighPaddingValue+"%";
        this.nmHighBand.style.height=nmHighBandValue+"%";
        this.nmMediumBand.style.height=nmMediumBandValue+"%";
        this.nmLowBand.style.height=nmLowBandValue+"%";
        this.nmLowPadding.style.height=nmLowPaddingBandValue+"%";

        //Writing labels

        if(this.nmHighValue!=0)
            this.nmHighLabel.textContent=Math.abs(this.nmHighValue);
        if(this.nmLowValue!=0)
            this.nmLowLabel.textContent=Math.abs(this.nmLowValue);
    }

    getNoiseMargin()
    {
        if(this.nmHighValue==this.nmLowValue)
            return this.nmHighValue;

        if(this.nmHighValue<this.nmLowValue)
            return this.nmHighValue;
        else
            return this.nmLowValue;
    }

    getExplanation()
    {

            let explanation=new Explanation();
            explanation.setCompatible(false);

            if( this.nmHighValue<=0  || this.nmLowValue<=0 || this.nmLowBandValue<=0 ||  this.outputGate.getVHMaxValue()>this.inputGate.getVHMaxValue() || this.outputGate.getVLMinValue()<this.inputGate.getVLMinValue())
                explanation.setTitle("Compuertas INCOMPATIBLES");
            else
            {
                explanation.setTitle("Compuertas COMPATIBLES.<br/>Margen de ruido "+this.getNoiseMargin());
                explanation.setExplanation("Las compuertas son compatibles por que los rangos de tensión de la compuerta de salida ESTAN incluidos en los rangos de tensión de la compuerta de entrada. El margen de ruido es el mas pequeño de los dos");

                explanation.setCompatible(true);
                return explanation;
            }


            if( this.nmHighValue==0 && this.nmLowValue==0 && this.outputGate.getVHMaxValue()<=this.inputGate.getVHMaxValue() && this.outputGate.getVLMinValue()>=this.inputGate.getVLMinValue())
            {
                explanation.setExplanation("No existe margen de ruido. El nivel de VOHmin es igual al de VIHmin y el nivel de VOLMax es igual al de VILMax. Si bien el rango de tensiones de la compuerta de salida esta contenido en el rango de tensiones de la compuerta de entrada, el menor ruido electromagnetico podria transformar una salida valida en un valor de tension que no podria ser entendido por la compuerta de entrada");
                return explanation;
            }

            if(this.inputGate.getVHMinValue()< this.inputGate.getVLMaxValue())
            {
                explanation.setExplanation("● El segmento de tensión que corresponde al valor de salida alto puede ser interpretado como un valor alto y bajo por la compuerta de entrada\r\n");
                return explanation;
            }


            if(this.outputGate.getVHMinValue()<this.inputGate.getVLMaxValue())
            {
                explanation.setExplanation("● El segmento de tensión que corresponde al valor de salida alto puede ser interpretado como un valor alto y bajo por la compuerta de entrada\r\n");
                return explanation;
            }

            if( this.outputGate.getVLMaxValue()>this.inputGate.getVHMinValue())
            {
                explanation.setExplanation("● El segmento de tensión que corresponde al valor de salida bajo puede ser interpretado como un valor alto y bajo por la compuerta de entrada\r\n");
                return explanation;
            }


            explanation.setExplanation("Las compuertas no son compatibles debido a:\r\n\r\n");



            if(this.outputGate.getVHMaxValue()>this.inputGate.getVHMaxValue())
                explanation.addExplanation("● VOHMax es mayor a VIHMax\r\n");

            if(this.outputGate.getVHMinValue()<this.inputGate.getVHMinValue())
                explanation.addExplanation("● VOHMin es menor a VIHMin\r\n");

            if(this.outputGate.getVHMinValue()===this.inputGate.getVHMinValue())
                explanation.addExplanation("● VOHMin es igual a VIHMin\r\n");

            if( this.outputGate.getVLMaxValue()>this.inputGate.getVLMaxValue())
                explanation.addExplanation("● VOLMax es mayor a VILMax\n");

            if(this.outputGate.getVLMaxValue()===this.inputGate.getVLMaxValue())
                explanation.addExplanation("● VOLMax es igual a VILMax\n");

            if(this.outputGate.getVLMinValue()<this.inputGate.getVLMinValue())
                explanation.addExplanation("● VOLMin es menor a VILMin\r\n");

            if(this.outputGate.getVHMinValue()<this.inputGate.getVLMaxValue())
                explanation.addExplanation("● El segmento de tensión que corresponde al valor de salida alto puede ser interpretado como un valor alto y bajo por la compuerta de entrada\r\n");


            return explanation;

    }
}


class ControlPanel
{
    #VOHMaxLabel;
    #VOHMinLabel;
    #VOLMaxLabel;
    #VOLMinLabel;
    #VIHMaxLabel;
    #VIHMinLabel;
    #VILMaxLabel;
    #VILMinLabel;
    #VOHMaxValue;
    #VOHMinValue;
    #VOLMaxValue;
    #VOLMinValue;
    #VIHMaxValue;
    #VIHMinValue;
    #VILMaxValue;
    #VILMinValue;

    #outputHigherPadding;
    #outputHighSegment;
    #outputMediumSegment;
    #outputLowSegment;
    #outputLowerPadding;

    #inputHigherPadding;
    #inputHigh;
    #inputMedium;
    #inputLow;
    #inputLowerPadding;


    #nmHighPadding
    #nmHigh
    #nmMediumPadding
    #nmLow
    #nmLowPadding
    #nmHighLabel
    #nmLowLabel


    #resultExplanation;
    #resultTitle;


    constructor()
    {
        this.VOHMaxLabel=document.querySelector('#VOHMaxLabel');
        this.VOHMinLabel=document.querySelector('#VOHMinLabel');
        this.VOLMaxLabel=document.querySelector('#VOLMaxLabel');
        this.VOLMinLabel=document.querySelector('#VOLMinLabel');
        this.VIHMaxLabel=document.querySelector('#VIHMaxLabel');
        this.VIHMinLabel=document.querySelector('#VIHMinLabel');
        this.VILMaxLabel=document.querySelector('#VILMaxLabel');
        this.VILMinLabel=document.querySelector('#VILMinLabel');
        this.VOHMaxValue=parseFloat(document.querySelector('#VOHMaxInput').value);
        this.VOHMinValue=parseFloat(document.querySelector('#VOHMinInput').value);
        this.VOLMaxValue=parseFloat(document.querySelector('#VOLMaxInput').value);
        this.VOLMinValue=parseFloat(document.querySelector('#VOLMinInput').value);
        this.VIHMaxValue=parseFloat(document.querySelector('#VIHMaxInput').value);
        this.VIHMinValue=parseFloat(document.querySelector('#VIHMinInput').value);
        this.VILMaxValue=parseFloat(document.querySelector('#VILMaxInput').value);
        this.VILMinValue=parseFloat(document.querySelector('#VILMinInput').value);



        this.outputHigherPadding=document.querySelector('.GateOutputHigherPadding');
        this.outputHighSegment  =document.querySelector('#GateOutputHigh');
        this.outputMediumSegment=document.querySelector('#GateOutputMedium');
        this.outputLowSegment   =document.querySelector('#GateOutputLow');
        this.outputLowerPadding =document.querySelector('.GateOutputLowerPadding');

        this.inputHigherPadding=document.querySelector('.GateInputHigherPadding');
        this.inputHighSegment=document.querySelector('#GateInputHigh');
        this.inputMediumSegment=document.querySelector('#GateInputMedium');
        this.inputLowSegment=document.querySelector('#GateInputLow');
        this.inputLowerPadding=document.querySelector('.GateInputLowerPadding');

        this.nmHighPadding=document.querySelector('.NoiseMarginHighPadding');
        this.nmHigh=document.querySelector('.NoiseMarginHigh');
        this.nmMediumPadding=document.querySelector('.NoiseMarginMediumPaddig');
        this.nmLow=document.querySelector('.NoiseMarginLow');
        this.nmLowPadding=document.querySelector('.NoiseMarginLowPadding');



        this.nmHighLabel=document.querySelector('.noiseMarginValueHigh');
        this.nmLowLabel=document.querySelector('.noiseMarginValueLow');


        this.resultExplanation=document.querySelector('.ResultExplanation');
        this.resultTitle=document.querySelector('.ResultTitle');

    }

    getVOHMaxLabel()
    {
        return this.VOHMaxLabel;
    }

    getVOHMinLabel()
    {
        return this.VOHMinLabel;
    }

    getVOLMaxLabel()
    {
        return this.VOLMaxLabel;
    }

    getVOLMinLabel()
    {
        return this.VOLMinLabel;
    }

    getVIHMaxLabel()
    {
        return this.VIHMaxLabel;
    }

    getVIHMinLabel()
    {
        return this.VIHMinLabel;
    }

    getVILMaxLabel()
    {
        return this.VILMaxLabel;
    }

    getVILMinLabel()
    {
        return this.VILMinLabel;
    }

    getVOHMaxValue()
    {
        return this.VOHMaxValue;
    }

    getVOHMinValue()
    {
        return this.VOHMinValue;
    }

    getVOLMaxValue()
    {
        return this.VOLMaxValue;
    }

    getVOLMinValue()
    {
        return this.VOLMinValue;
    }

    getVIHMaxValue()
    {
        return this.VIHMaxValue;
    }

    getVIHMinValue()
    {
        return this.VIHMinValue;
    }

    getVILMaxValue()
    {
        return this.VILMaxValue;
    }

    getVILMinValue()
    {
        return this.VILMinValue;
    }

    getOutputHigherPadding()
    {
        return this.outputHigherPadding;
    }

    getOutputHighSegment()
    {
        return this.outputHighSegment;
    }

    getOutputMediumSegment()
    {
        return this.outputMediumSegment;
    }

    getOutputLowSegment()
    {
        return this.outputLowSegment;
    }

    getOutputLowerPadding()
    {
        return this.outputLowerPadding;
    }

    getInputHigherPadding()
    {
        return this.inputHigherPadding;
    }

    getInputHighSegment()
    {
        return this.inputHighSegment
    }

    getInputMediumSegment()
    {
        return this.inputMediumSegment;
    }

    getInputLowSegment()
    {
        return this.inputLowSegment;
    }

    getInputLowerPadding()
    {
        return this.inputLowerPadding;
    }


    getNMHighPadding()
    {
        return this.nmHighPadding;
    }

    getNMHigh()
    {
        return this.nmHigh;
    }

    getNMMediumPadding()
    {
        return this.nmMediumPadding;
    }

    getNMLow()
    {
        return this.nmLow;
    }

    getNMLowPadding()
    {
        return this.nmLowPadding;
    }


    getNMHighLabel()
    {
        return this.nmHighLabel;
    }

    getNMLowLabel()
    {
        return this.nmLowLabel;

    }

    getResultTitle()
    {
        return this.resultTitle;
    }

    getResultExplanation()
    {
        return this.resultExplanation;
    }

    setExplanation(explanation)
    {

        this.resultTitle.style.whiteSpace="pre-line";
        this.resultExplanation.style.whiteSpace="pre-line"

        if(explanation.getValid() === false)
            this.resultTitle.style.color="var(--wrongNMColor)";
        else
            this.resultTitle.style.color="var(--rightNMColor)";

        this.resultTitle.innerHTML=explanation.getTitle();
        this.resultExplanation.textContent=explanation.getExplanation();
    }

    clearMessages()
    {
        resultExplanation.textContent="";
        resultTitle.textContent="";
    }

    checkValues()
    {


        let explanation=new Explanation();

        explanation.setCompatible(true);

        if(isNaN(this.VOHMaxValue)===false)
        {
           if(this.VOHMaxValue<0)
           {
                explanation.setCompatible(false);
                explanation.addExplanation("●VOHMax es menor a 0\r\n");
           }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VOHMax esta vacio\r\n");
        }

        if(isNaN(this.VOHMinValue)===false)
        {
            if(this.VOHMinValue<0)
            {
                explanation.setCompatible(false);
                explanation.addExplanation("● VOHMin es menor a 0\r\n");
            }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VOHMin esta vacio\r\n");
        }

        if(isNaN(this.VOLMaxValue)===false)
        {
            if(this.VOLMaxValue<0)
            {
                explanation.setCompatible(false);
                explanation.addExplanation("● VOLMax es menor a 0\r\n");
            }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VOLMax esta vacio\r\n");
        }

        if(isNaN(this.VOLMinValue)===false)
        {
             if(this.VOLMinValue<0)
             {
                explanation.setCompatible(false);
                explanation.addExplanation("● VOLMin es menor a 0\r\n");
             }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VOLMin esta vacio\r\n");
        }

        if(isNaN(this.VIHMaxValue)===false)
        {
            if(this.VIHMaxValue<0)
            {
                explanation.setCompatible(false);
                explanation.addExplanation("● VIHMax es menor a 0\r\n");
            }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VIHMax esta vacio\r\n");
        }

        if(isNaN(this.VIHMinValue)===false)
        {
            if(this.VIHMinValue<0)
            {
                explanation.setCompatible(false);
                explanation.addExplanation("● VIHMin es menor a 0\r\n");
            }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VIHMin esta vacio\r\n");
        }

        if(isNaN(this.VILMaxValue)===false)
        {
             if(this.VILMaxValue<0)
             {
                explanation.setCompatible(false);
                explanation.addExplanation("● VILMax es menor a 0\r\n");
             }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VILMax esta vacio\r\n");
        }

        if(isNaN(this.VILMinValue)===false)
        {
             if(this.VILMinValue<0)
             {
                explanation.setCompatible(false);
                explanation.addExplanation("● VILMin es menor a 0\r\n");
             }
        }
        else
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● El campo VILMin esta vacio\r\n");
        }


        if(explanation.getValid()==false)
        {
            explanation.setTitle("Compuertas INCOMPATIBLES");
            return explanation;
        }


        if(this.VOHMaxValue.toString().indexOf(".")!=-1)
        {
            if(this.VOHMaxValue.toString().split(".")[1].length>2)
            {
                explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }
        }

        if(this.VOHMinValue.toString().indexOf(".")!=-1)
        {
            if(this.VOHMinValue.toString().split(".")[1].length>2)
            {
                explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }
        }

        if(this.VOLMaxValue.toString().indexOf(".")!=-1)
        {
            if(this.VOLMaxValue.toString().split(".")[1].length>2)
            {
                explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }
        }

        if(this.VOLMinValue.toString().indexOf(".")!=-1)
        {
            if(this.VOLMinValue.toString().split(".")[1].length>2)
            {
                explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }
        }

        if(this.VIHMaxValue.toString().indexOf(".")!=-1)
        {
            if(this.VIHMaxValue.toString().split(".")[1].length>2)
            {
               explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }
        }

        if(this.VIHMinValue.toString().indexOf(".")!=-1)
        {
            if(this.VIHMinValue.toString().split(".")[1].length>2)
            {
               explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }
        }

        if(this.VILMaxValue.toString().indexOf(".")!=-1)
        {
            if(this.VILMaxValue.toString().split(".")[1].length>2)
            {
               explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }

        }

        if(this.VILMinValue.toString().indexOf(".")!=-1)
        {
            if(this.VILMinValue.toString().split(".")[1].length>2)
            {
                explanation.setCompatible(false);
                explanation.setTitle("Solamente se aceptan numeros con hasta 2 decimales");
                return explanation;
            }
        }



        if(this.VOHMaxValue<=this.VOHMinValue)
        {

            explanation.setCompatible(false);
            explanation.addExplanation("● VOHMax es menor o igual que VOHMin\r\n");
        }

        if(this.VOLMaxValue<=this.VOLMinValue)
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● VOLMax es menor o igual que VOLMin\r\n");
        }

        if(this.VIHMaxValue<=this.VIHMinInput)
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● VIHMax es menor o igual que VIHMin\r\n");
        }

        if(this.VILMaxValue<=this.VILMinValue)
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● VILMax es menor o igual que VILMin\r\n");
        }


        if(this.VILMaxValue>=this.VIHMinValue)
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● VILMax es mayor o igual que VIHMin\r\n");
        }


        if(this.VOLMaxValue>=this.VOHMinValue)
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● VOLMax es mayor o igual que VOHMin\r\n");
        }


        if(explanation.getValid()==true)
        {

        if(this.VOHMinValue<=this.VOLMaxValue)
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● VOLMax es mayor o igual que VOHMin\r\n");
        }

        if(this.VIMinValue<=this.VILMaxValue)
        {
            explanation.setCompatible(false);
            explanation.addExplanation("● VILMax es menor o igual que VILMin\r\n");
        }

        }

        if(explanation.getValid() === false)
        {
            explanation.setTitle("Compuertas INCOMPATIBLES");
            explanation.addExplanation("\r\n Revise los datos de entrada y pruebe nuevamente");
        }


        return explanation;

    }

    calculate()
    {
        const VOHMaxValue=document.querySelector('#VOHMaxInput').value;
        const VOHMinValue=document.querySelector('#VOHMinInput').value;
        const VOLMaxValue=document.querySelector('#VOLMaxInput').value;
        const VOLMinValue=document.querySelector('#VOLMinInput').value;

        const VIHMaxValue=document.querySelector('#VIHMaxInput').value;
        const VIHMinValue=document.querySelector('#VIHMinInput').value;
        const VILMaxValue=document.querySelector('#VILMaxInput').value;
        const VILMinValue=document.querySelector('#VILMinInput').value;


        const NoiseMarginValueHigh = document.querySelector('.noiseMarginValueHigh');
        const NoiseMarginValueLow = document.querySelector('.noiseMarginValueLow');


        const gateOutput=new Gate(this.getVOHMaxLabel(),this.getVOHMinLabel(),this.getVOLMaxLabel(),this.getVOLMinLabel(),VOHMaxValue,VOHMinValue,VOLMaxValue,VOLMinValue, this.getOutputHigherPadding(),this.getOutputHighSegment(),this.getOutputMediumSegment(), this.getOutputLowSegment(), this.getOutputLowerPadding(),false);

        const gateInput=new Gate(this.getVIHMaxLabel(),this.getVIHMinLabel(),this.getVILMaxLabel(),this.getVILMinLabel(),VIHMaxValue,VIHMinValue,VILMaxValue,VILMinValue, this.getInputHigherPadding(),this.getInputHighSegment(),this.getInputMediumSegment(), this.getInputLowSegment(), this.getInputLowerPadding(),true);

        const noiseMargin = new NoiseMargin(gateOutput,gateInput,this.getNMHighPadding(),this.getNMHigh(),this.getNMMediumPadding(), this.getNMLow(), this.getNMLowPadding(),this.getNMHighLabel(),this.getNMLowLabel());

        gateOutput.reset();
        gateInput.reset();
        noiseMargin.clear();


        let inputDictionary={};
        inputDictionary["VOHMaxInput"]=parseFloat(VOHMaxValue);
        inputDictionary["VOHMinInput"]=parseFloat(VOHMinValue);
        inputDictionary["VOLMaxInput"]=parseFloat(VOLMaxValue);
        inputDictionary["VOLMinInput"]=parseFloat(VOLMinValue);
        inputDictionary["VIHMaxInput"]=parseFloat(VIHMaxValue);
        inputDictionary["VIHMinInput"]=parseFloat(VIHMinValue);
        inputDictionary["VILMaxInput"]=parseFloat(VILMaxValue);
        inputDictionary["VILMinInput"]=parseFloat(VILMinValue);

        let messagesDictionary={}
        messagesDictionary["ResultTitle"]=this.getResultTitle();
        messagesDictionary["ResultExplanation"]=this.getResultExplanation();

        const extremes=findExtrems(inputDictionary);

        let result=this.checkValues(inputDictionary,messagesDictionary);

        if(result.getValid()===true)
        {
            gateOutput.draw(extremes);
            gateInput.draw(extremes);
            noiseMargin.draw(extremes);
            this.setExplanation(noiseMargin.getExplanation());

        }
        else
        {
            this.setExplanation(result)
        }

        previousGateInput=gateInput;
        previousGateOutput=gateOutput;


    }
}

function calculate()
{
    const panel=new ControlPanel();
    panel.calculate();
    const result=document.querySelector('.ResultInfo');
    const share=document.querySelector('#Share');
    share.style.display="block";
    result.scrollIntoView({ block: "end", behavior: "smooth" });

}

function checkForParameters()
{
    let url=new URL(document.URL);
    let params=url.searchParams;

    if(params.has("VOHMax")==true && params.has("VOHMin")==true && params.has("VOLMax")==true && params.has("VOLMin")==true )
    {
        if(params.has("VIHMax")==true && params.has("VIHMin")==true && params.has("VILMax")==true && params.has("VILMin")==true )
        {
            const VOHMax=document.querySelector('#VOHMaxInput');
            const VOHMin=document.querySelector('#VOHMinInput');
            const VOLMax=document.querySelector('#VOLMaxInput');
            const VOLMin=document.querySelector('#VOLMinInput');

            const VIHMax=document.querySelector('#VIHMaxInput');
            const VIHMin=document.querySelector('#VIHMinInput');
            const VILMax=document.querySelector('#VILMaxInput');
            const VILMin=document.querySelector('#VILMinInput');


            VOHMax.value=params.get("VOHMax");
            VOHMin.value=params.get("VOHMin");
            VOLMax.value=params.get("VOLMax");
            VOLMin.value=params.get("VOLMin");
            VIHMax.value=params.get("VIHMax");
            VIHMin.value=params.get("VIHMin");
            VILMax.value=params.get("VILMax");
            VILMin.value=params.get("VILMin");


            calculate();

        }
    }

}


function configureFocus()
{
    const VOHMax=document.querySelector('#VOHMaxInput');
    const VOHMin=document.querySelector('#VOHMinInput');
    const VOLMax=document.querySelector('#VOLMaxInput');
    const VOLMin=document.querySelector('#VOLMinInput');

    const VIHMax=document.querySelector('#VIHMaxInput');
    const VIHMin=document.querySelector('#VIHMinInput');
    const VILMax=document.querySelector('#VILMaxInput');
    const VILMin=document.querySelector('#VILMinInput');
    const calculate = document.querySelector('#Calculate');


    VOHMax.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter" ){VOHMin.focus()}});
    VOHMin.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter"){VOLMax.focus()}});
    VOLMax.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter"){VOLMin.focus()}});
    VOLMin.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter"){VIHMax.focus()}});
    VIHMax.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter"){VIHMin.focus()}});
    VIHMin.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter"){VILMax.focus()}});
    VILMax.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter"){VILMin.focus()}});
    VILMin.addEventListener("keypress", (keyEvent)=>{if(keyEvent.code == "Enter"){calculate.focus()}});

}

function closeSharePopup()
{
    const popup = document.querySelector('#SharePopup');
    popup.style.display="none";
}

function showSharePopup()
{
    const popup = document.querySelector('#SharePopup');
    const url = document.querySelector('#urlText');
    let urlToShare=new URL(document.URL);

    const parameters=new URLSearchParams();

    parameters.append("VOHMax",previousGateOutput.getVHMaxValue());
    parameters.append("VOHMin",previousGateOutput.getVHMinValue());
    parameters.append("VOLMax",previousGateOutput.getVLMaxValue());
    parameters.append("VOLMin",previousGateOutput.getVLMinValue());

    parameters.append("VIHMax",previousGateInput.getVHMaxValue());
    parameters.append("VIHMin",previousGateInput.getVHMinValue());
    parameters.append("VILMax",previousGateInput.getVLMaxValue());
    parameters.append("VILMin",previousGateInput.getVLMinValue());


    urlToShare=urlToShare.origin+urlToShare.pathname+"?"+parameters.toString();

    url.value=urlToShare.toString();
    popup.style.display="block";

}

function configureSharePopup()
{
    const share = document.querySelector('#Share');
    const closeShare = document.querySelector('#CloseShare');
    share.addEventListener('click',showSharePopup);
    closeShare.addEventListener('click',closeSharePopup);
}

configureFocus();
configureSharePopup();

document.addEventListener('DOMContentLoaded',checkForParameters);
document.querySelector('#Calculate').addEventListener('click',calculate);




