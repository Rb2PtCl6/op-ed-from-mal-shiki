class ChtwSettings {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.settings = JSON.parse(localStorage.getItem('chtwSettings')) || {};
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getSettings() {
        return this.settings[this.id];
    }

    deleteSettings() {
        this.settings[this.id] = {};
        localStorage.setItem('chtwSettings', JSON.stringify(this.settings));
    }

    getOption(id) {
        if (this.settings[this.id] === undefined || this.settings[this.id][id] === undefined) {
            return false;
        }
        return this.settings[this.id][id];
    }

    getOptionID(id) {
        if (this.settings[this.id] === undefined || this.settings[this.id][id] === undefined) {
            return false;
        }
        return 'chtwScript' + this.id + id;
    }

    setOption(id, value) {
        if (this.settings[this.id] === undefined) {
            this.settings[this.id] = {};
        }
        this.settings[this.id][id] = (this.settings[this.id][id] !== undefined) ? this.settings[this.id][id] : value;
        localStorage.setItem('chtwSettings', JSON.stringify(this.settings));
    }

    setOptionForced(id, value) {
        if (this.settings[this.id] === undefined) {
            this.settings[this.id] = {};
        }
        this.settings[this.id][id] = value;
        localStorage.setItem('chtwSettings', JSON.stringify(this.settings));
    }

    setOptions(options) {
        for (const [key, value] of Object.entries(options)) {
            this.settings[this.id][key] = (this.settings[this.id][key] !== undefined) ? this.settings[this.id][key] : value;
        }
        localStorage.setItem('chtwSettings', JSON.stringify(this.settings));
    }

    createOption(id, text, value = true, type = 'checkbox', isFullWidth = false) {
        // Определяем тип value и вводим в настройки
        this.setOption(id, typeof value === 'object' ? Object.values(value)[0] : value);

        if (!location.href.includes("edit/misc")) return false;
        if (document.getElementById('chtwScript' + this.id + id)) return false;

        // создаем label
        let label = document.createElement('label');
        label.htmlFor = 'chtwScript' + this.id + id;
        // Создаем элемент input / select
        const element = document.createElement(type == "select" ? "select" : "input")
        element.id = 'chtwScript' + this.id + id;
        if (type !== 'select')
            element.type = type;

        if (isFullWidth) {
            element.style.maxWidth = '100%';
            element.style.height = '30px';
            label.style.justifyContent = 'center';
            label.style.flexWrap = 'wrap';
        }
        // Если тип select, то добавляем опции с объекта value
        if (type === 'select') {
            for (let key in value) {
                const option = document.createElement("option");
                option.textContent = key;
                option.value = value[key];
                element.append(option);
            }
        }
        // Назначаем элемент значением
        element[type === 'checkbox' ? "checked" : "value"] = this.settings[this.id][id];

        element.addEventListener("change", (event) => {
            this.settings[this.id][id] = event.currentTarget[type === 'checkbox' ? "checked" : "value"];

            if (event.currentTarget["id"] === 'chtwScriptcustomStyleclrLabel') {
                let style = `.chtw-setting-title { color: ${event.currentTarget["value"]}; }`;
                this.addStyle(style);
            }
            if (event.currentTarget["id"] === 'chtwScriptcustomStylebgLabel') {
                let style = `.chtw-setting-title { background: ${event.currentTarget["value"]}; }`;
                this.addStyle(style);
            }
            if (event.currentTarget["id"] === 'chtwScriptcustomStylebgOther') {
                let style = `.chtw-settings-block { background: ${event.currentTarget["value"]}; }`;
                this.addStyle(style);
            }
            if (event.currentTarget["id"] === 'chtwScriptcustomStyleclrOther') {
                let style = `.chtw-settings-block { color: ${event.currentTarget["value"]}; }`;
                this.addStyle(style);
            }

            localStorage.setItem('chtwSettings', JSON.stringify(this.settings));
        })
        label.appendChild(element);
        label.appendChild(document.createTextNode(text));

        // создаем блок настроек скриптов, если его еще нет; также создаем подблок конкретного скрипта
        let settingsWrap = !document.getElementById('chtwSettingsWrap') ? this.#createSettingsMainBlock() : document.getElementById('chtwSettingsWrap');
        let settingsOption = !document.getElementById('chtwScript' + this.id) ? this.#createSettingsChildBlock('chtwScript' + this.id, this.name) : document.getElementById('chtwScript' + this.id);

        settingsOption.append(label); // прикрепляем настройку к подблоку скрипта
        settingsWrap.append(settingsOption); // прикрепляем подблок скрипта к блоку настроек

    }
    #createSettingsMainBlock() {
        //Берем настройки или берем дефолт
        const customColors = this.settings.customStyle || {
            clrLabel: "#1e1f20",
            bgLabel: "#a3a3a3",
            bgOther: "#cacfd3",
            clrOther: "#333333"
        }
        let style = `
                summary { cursor: pointer }
                #chtwSettings input { color: initial; }
                .chtw-setting-title {
                    font-size: 16px;
                    border-radius: 10px;
                    text-align: center;
                    background: ${customColors.bgLabel};
                    padding: 5px 15px;
                    color: ${customColors.clrLabel};
                    margin-bottom: 10px;
                }
                .chtw-settings-block {
                    display: flex;
                    flex-direction: column;
                    width: 18%;
                    max-width: 18%;
                    line-height: 1.5;
                    background: ${customColors.bgOther};
                    border-radius: 10px;
                    padding: 10px;
                    color:${customColors.clrOther};
                }
                .chtw-settings-wrap { display: flex; gap: 15px; flex-wrap: wrap; justify-content: space-evenly; }
                .chtw-settings-wrap label { border-bottom: 1px solid #ffffff2b; display: flex; padding-bottom: 2px; padding-top: 2px; align-items: center; }
                .chtw-settings-wrap label input { margin-right: 5px; max-width: 40px; text-align: center; }
                .chtw-settings-wrap label select { margin-right: 5px; max-width: 50%; text-overflow: ellipsis; white-space: nowrap:}
                #chtwSettingsStyle{position: absolute; top: 0; right: 0;}
                #chtwSettingsStyle::before{content: '✎'; display: block; font-size: 20px; width: 30px; height: 30px; text-align: center; line-height: 30px; cursor: pointer;}
                `;
        let parent = document.querySelector('.block.edit-page.misc');
        let settingsSummary = document.createElement('details');
        settingsSummary.open = true;
        settingsSummary.classList.add('block', 'is-own-profile');

        let settingsSummaryInner = document.createElement('summary');
        settingsSummaryInner.innerText = 'Настройки скриптов';
        settingsSummaryInner.classList.add('subheadline');

        let settingsMainBlock = document.createElement('div');
        settingsMainBlock.classList.add('cc');

        let settingsWrap = document.createElement('div');
        settingsWrap.classList.add('chtw-settings-wrap');
        settingsWrap.id = 'chtwSettingsWrap';

        // Добавил кнопку настройку стиля
        let settingsEditStyle = document.createElement("div")
        settingsEditStyle.id='chtwSettingsStyle'
        settingsEditStyle.onclick = function(e){
            let isNone = getComputedStyle(chtwScriptcustomStyle).display
            chtwScriptcustomStyle.style.display = isNone=="flex"?"none":"flex";
        }

        settingsSummary.append(settingsEditStyle);
        settingsMainBlock.append(settingsWrap);

        settingsSummary.append(settingsSummaryInner);
        settingsSummary.append(settingsMainBlock);

        settingsSummary.id = 'chtwSettings';
        parent.append(settingsSummary);

        this.addStyle(style);

        return settingsWrap;
    }

    #createSettingsChildBlock(id, name) {
        let settingsBlock = document.createElement('div');
        settingsBlock.id = id;
        settingsBlock.classList.add('chtw-settings-block');

        let SBTitle = document.createElement('div');
        SBTitle.innerHTML = name;
        SBTitle.classList.add('chtw-setting-title');

        settingsBlock.append(SBTitle);

        return settingsBlock;
    }

    addStyle(style) {
        document.head.append(Object.assign(document.createElement("style"), { textContent: style }));
    }
}

function ready(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") fn();
    else document.addEventListener('DOMContentLoaded', fn);
}

function createCustomStyle() {
    let settings = new ChtwSettings("customStyle","Свой стиль");
    settings.createOption("clrLabel","Цвет название","#1e1f20","color");
    settings.createOption("bgLabel","Фон название","#a3a3a3","color");
    settings.createOption("bgOther","Фон блока","#cacfd3","color");
    settings.createOption("clrOther","Цвет текста","#333333","color");
}
ready(createCustomStyle);