// plugins/pintura.client.ts
import { defineNuxtPlugin } from "#app";
import {
  getEditorDefaults,
  locale_en_gb,
  plugin_annotate_locale_en_gb,
  markup_editor_locale_en_gb,
} from "@pqina/pintura";
import { PinturaEditor } from "@pqina/vue-pintura";
import "@pqina/pintura/pintura.css";

const ruLocale = {
  ...locale_en_gb,
  ...plugin_annotate_locale_en_gb,
  ...markup_editor_locale_en_gb,

  // Статусы загрузки
  statusImageLoadNone: "Ожидание загрузки изображения&hellip;",
  statusImageLoadPrepare: "Подготовка изображения&hellip;",
  statusImageLoadBusy: "Загрузка изображения&hellip;",
  statusImageLoadError: "Ошибка обработки изображения",
  statusImageProcessBusy: "Обработка изображения&hellip;",

  //основные действия
  labelButtonUndo: "Отменить",
  labelButtonRedo: "Повторить",
  labelButtonRevert: "Отменить всё",
  labelButtonExport: "Экспорт",

  //инструменты
  shapeLabelToolMove: "Редактирование",
  shapeLabelToolView: "Просмотр",
  shapeLabelToolEraser: "Ластик",
  shapeLabelToolSharpie: "Кривая",
  shapeLabelToolArrow: "Стрелка",
  shapeLabelToolLine: "Линия",
  shapeLabelToolRectangle: "Прямоугольник",
  shapeLabelToolEllipse: "Круг",
  shapeLabelToolText: "Текст",
  shapeLabelToolPath: "Путь",

  //инструменты созданных объектов
  shapeTitleButtonFlipHorizontal: "Отразить по горизонтали",
  shapeTitleButtonMoveToFront: "Переместить вперед",
  shapeTitleButtonDuplicate: "Копировать",
  shapeTitleButtonRemove: "Удалить",
  shapeLabelInputText: "Редактировать текст",
  shapeTitleButtonTextLayoutAutoHeight: "Автоматическая высота",

  //масштабирование
  labelZoom: "Масштаб",
  labelZoomActual: "Полный масштаб",
  labelZoomFit: "В пределах области просмотра",
  labelZoomIn: "Увеличить",
  labelZoomOut: "Уменьшить",

  // Толщина линии
  labelSizeExtraSmall: "Очень тонкая",
  labelSizeSmall: "Тонкая",
  labelSizeMediumSmall: "Средне-тонкая",
  labelSizeMedium: "Средняя",
  labelSizeMediumLarge: "Средне-толстая",
  labelSizeLarge: "Толстая",
  labelSizeExtraLarge: "Очень толстая",

  shapeLabelStrokeNone: "Без обводки",

  //наконечники стрелочки
  shapeTitleLineStart: "Начало",
  shapeTitleLineEnd: "Конец",

  shapeTitleLineNone: "Без наконечника",
  shapeTitleLineDecorationBar: "Засечка",
  shapeTitleLineDecorationArrow: "Стрелка",
  shapeTitleLineDecorationArrowSolid: "Заполненная стрелка",
  shapeTitleLineDecorationCircle: "Круг",
  shapeTitleLineDecorationCircleSolid: "Заполненный круг",
  shapeTitleLineDecorationSquare: "Квадрат",
  shapeTitleLineDecorationSquareSolid: "Заполненный квадрат",

  //параметры формы
  shapeTitleStrokeColor: "Цвет линии",
  shapeTitleStrokeWidth: "Толщина линии",
  shapeTitleBackgroundColor: "Цвет заливки",

  //параметры текста
  shapeTitleCornerRadius: "Радиус",
  shapeTitleTextColor: "Цвет текста",
  shapeTitleFontFamily: "Шрифт",
  shapeTitleFontStyle: "Стиль",
  shapeTitleFontSize: "Размер",
  shapeTitleLineHeight: "Высота строки",
  shapeTitleTextAlign: "Выравнивание",

  //стиль шрифта
  shapeLabelFontStyleNormal: "Обычный",
  shapeLabelFontStyleBold: "Жирный",
  shapeLabelFontStyleItalic: "Курсив",
  shapeLabelFontStyleItalicBold: "Жирный курсив",

  labelNone: "Нет",
  labelColorPalette: "Цветовая палитра",
};

//поиск нужного ключа локали по значению
//const keyByValue = Object.keys(ruLocale).filter(key => ruLocale[key as keyof typeof ruLocale] === 'Значение')
//console.log(keyByValue)

export default defineNuxtPlugin((nuxtApp) => {
  const defaults = getEditorDefaults({
    utils: ["annotate"],
    locale: ruLocale,
    enableMoveTool: true,
    enableViewTool: true,
  });

  nuxtApp.vueApp.component("PinturaEditor", PinturaEditor);

  return {
    provide: {
      pinturaDefaults: defaults,
    },
  };
});
