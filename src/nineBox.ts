/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "./../style/nineBox.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";

export class NineBox implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;

    // Creating HEADERS elements
    private pLH: HTMLElement = document.createElement("p");
    private pMH: HTMLElement = document.createElement("p");
    private pHH: HTMLElement = document.createElement("p");
    private pLM: HTMLElement = document.createElement("p");
    private pMM: HTMLElement = document.createElement("p");
    private pHM: HTMLElement = document.createElement("p");
    private pLL: HTMLElement = document.createElement("p");
    private pML: HTMLElement = document.createElement("p");
    private pHL: HTMLElement = document.createElement("p");

    // Creating BOX elements
    private boxLH: HTMLElement = document.createElement("box");
    private boxMH: HTMLElement = document.createElement("box");
    private boxHH: HTMLElement = document.createElement("box");
    private boxLM: HTMLElement = document.createElement("box");
    private boxMM: HTMLElement = document.createElement("box");
    private boxHM: HTMLElement = document.createElement("box");
    private boxLL: HTMLElement = document.createElement("box");
    private boxML: HTMLElement = document.createElement("box");
    private boxHL: HTMLElement = document.createElement("box");

    private boxes = [this.boxLH, this.boxMH, this.boxHH, this.boxLM, this.boxMM, this.boxHM, this.boxLL, this.boxML, this.boxHL]

    // Creating LIST elements
    private listLH: HTMLElement = document.createElement("ul");
    private listMH: HTMLElement = document.createElement("ul");
    private listHH: HTMLElement = document.createElement("ul");
    private listLM: HTMLElement = document.createElement("ul");
    private listMM: HTMLElement = document.createElement("ul");
    private listHM: HTMLElement = document.createElement("ul");
    private listLL: HTMLElement = document.createElement("ul");
    private listML: HTMLElement = document.createElement("ul");
    private listHL: HTMLElement = document.createElement("ul");

    private lists = [this.listLH, this.listMH, this.listHH, this.listLM, this.listMM, this.listHM, this.listLL, this.listML, this.listHL]

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        if (document) {

            // Creating Canvas for Visualization
            const canvas: HTMLElement = document.createElement("div");
            canvas.setAttribute("id", "nineBox");

            // Settting ID attributes
            this.boxLH.setAttribute("id", "boxLH");
            this.boxMH.setAttribute("id", "boxMH");
            this.boxHH.setAttribute("id", "boxHH");
            this.boxLM.setAttribute("id", "boxLM");
            this.boxMM.setAttribute("id", "boxMM");
            this.boxHM.setAttribute("id", "boxHM");
            this.boxLL.setAttribute("id", "boxLL");
            this.boxML.setAttribute("id", "boxML");
            this.boxHL.setAttribute("id", "boxHL");

            // Writing headers
            this.pLH.appendChild(document.createTextNode("Potential Gem"));
            this.pMH.appendChild(document.createTextNode("High Potential"));
            this.pHH.appendChild(document.createTextNode("Star"));
            this.pLM.appendChild(document.createTextNode("Inconsistent Player"));
            this.pMM.appendChild(document.createTextNode("Core Player"));
            this.pHM.appendChild(document.createTextNode("High Performer"));
            this.pLL.appendChild(document.createTextNode("Risk"));
            this.pML.appendChild(document.createTextNode("Average Performer"));
            this.pHL.appendChild(document.createTextNode("Solid Performer"));

            // Adding HTML elements (headers and lists) to boxes
            this.boxLH.appendChild(this.pLH).appendChild(this.listLH);
            this.boxMH.appendChild(this.pMH).appendChild(this.listMH);
            this.boxHH.appendChild(this.pHH).appendChild(this.listHH);
            this.boxLM.appendChild(this.pLM).appendChild(this.listLM);
            this.boxMM.appendChild(this.pMM).appendChild(this.listMM);
            this.boxHM.appendChild(this.pHM).appendChild(this.listHM);
            this.boxLL.appendChild(this.pLL).appendChild(this.listLL);
            this.boxML.appendChild(this.pML).appendChild(this.listML);
            this.boxHL.appendChild(this.pHL).appendChild(this.listHL);

            // Add boxes to canvas
            this.boxes.forEach(box => {
                canvas.appendChild(box);
            });

            // Add canvas to target
            this.target.appendChild(canvas);
        }
    }

    public update(options: VisualUpdateOptions) {
        // Clear list on update
        this.lists.forEach(list => {
            list.innerHTML = "";
        });

        function calculateScores(performanceData: any[], potentialData: any[], namesData: any[]) {
            var result = [];
            for (var i = 0; i < Math.max(performanceData.length, potentialData.length, namesData.length); i++) {
                result.push(
                    {
                        performance: performanceData[i] || 0,
                        potential: potentialData[i] || 0,
                        name: namesData[i]
                    }
                );
            }
            return result;
        }

        function prepareList(boxElement, resultName) {
            let listItem = document.createElement("li");
            listItem.innerHTML = resultName;
            boxElement.appendChild(listItem);
        }

        this.settings = NineBox.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);

        let dataView: DataView = options.dataViews[0];

        let thresholdL1 = (100 / 3)   // 33.333333333333336
        let thresholdL2 = (200 / 3)   // 66.66666666666667

        let performanceData = dataView.categorical.values[0].values
        let potentialData = dataView.categorical.values[1].values
        let namesData = dataView.categorical.categories[0].values
        let results = calculateScores(performanceData, potentialData, namesData)

        results.forEach(result => {
            if (result.performance < thresholdL1 && result.potential < thresholdL1) { prepareList(this.listLL, result.name) }
            else if (result.performance < thresholdL1 && result.potential > thresholdL1 && result.potential < thresholdL2) { prepareList(this.listLM, result.name) }
            else if (result.performance < thresholdL1 && result.potential > thresholdL2) { prepareList(this.listLH, result.name) }
            else if (result.performance > thresholdL1 && result.performance < thresholdL2 && result.potential < thresholdL1) { prepareList(this.listML, result.name) }
            else if (result.performance > thresholdL1 && result.performance < thresholdL2 && result.potential > thresholdL1 && result.potential < thresholdL2) { prepareList(this.listMM, result.name) }
            else if (result.performance > thresholdL1 && result.performance < thresholdL2 && result.potential > thresholdL2) { prepareList(this.listMH, result.name) }
            else if (result.performance > thresholdL2 && result.potential < thresholdL1) { prepareList(this.listHL, result.name) }
            else if (result.performance > thresholdL2 && result.potential > thresholdL1 && result.potential < thresholdL2) { prepareList(this.listHM, result.name) }
            else if (result.performance > thresholdL2 && result.potential > thresholdL2) { prepareList(this.listHH, result.name) }
        });

        // Override Custom BG Color to boxes
        if (this.settings.nineBox.useCustomColors) {
            this.boxLH.style.background = this.settings.nineBox.boxLHColor;
            this.boxMH.style.background = this.settings.nineBox.boxMHColor;
            this.boxHH.style.background = this.settings.nineBox.boxHHColor;
            this.boxLM.style.background = this.settings.nineBox.boxLMColor;
            this.boxMM.style.background = this.settings.nineBox.boxMMColor;
            this.boxHM.style.background = this.settings.nineBox.boxHMColor;
            this.boxLL.style.background = this.settings.nineBox.boxLLColor;
            this.boxML.style.background = this.settings.nineBox.boxMLColor;
            this.boxHL.style.background = this.settings.nineBox.boxHLColor;
        } else {
            this.boxes.forEach(box => {
                box.style.background = "";
            });
        }

        // Override LI font size
        let listItemsEl = document.getElementsByTagName("li");
        for (let index = 0; index < listItemsEl.length; index++) {
            listItemsEl[index].style.fontSize = this.settings.nineBox.fontSize.toString() + "px";
        }
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
    
}
