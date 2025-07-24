import { TemplateField } from "@/types/templates/template";

const browProductTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "series", label: "Seriya", type: "text" },
  { name: "type", label: "Növ", type: "text" },
  { name: "weight", label: "Həcm/çəki", type: "text" },
  { name: "color", label: "Rəng", type: "text" },
];

const browShadowTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "series", label: "Seriya", type: "text" },
  { name: "type", label: "Növ", type: "text" },
  { name: "volumeOrWeight", label: "Həcm/çəki", type: "number" },
  { name: "color", label: "Rəng", type: "text" },
  { name: "brandCountry", label: "Brendin ölkəsi", type: "text" }
];

const browFixatorTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "series", label: "Seriya", type: "text" },
  { name: "type", label: "Növ", type: "text" },
  { name: "volumeOrWeight", label: "Həcm/çəki", type: "text" },
  { name: "color", label: "Rəng", type: "text" },
];

const toothpasteTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "purpose", label: "Təyinat", type: "text" },
  { name: "volumeOrWeight", label: "Həcm/çəki", type: "number" },
  { name: "age", label: "Yaş", type: "text" },
  { name: "features", label: "Xüsusiyyətləri", type: "text" },
  { name: "brandCountry", label: "Brendin ölkəsi", type: "text" }
];

const facePowderTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "series", label: "Seriya", type: "text" },
  { name: "purpose", label: "Təyinat", type: "text" },
  { name: "type", label: "Növ", type: "text" },
  { name: "volumeOrWeight", label: "Həcm/çəki", type: "number" },
  { name: "color", label: "Rəng", type: "text" },
  { name: "brandCountry", label: "Brendin ölkəsi", type: "text" }
];

const eyeShadowTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "series", label: "Seriya", type: "text" },
  { name: "features", label: "Xüsusiyyətləri", type: "text" },
  { name: "purpose", label: "Təyinat", type: "text" },
  { name: "type", label: "Növ", type: "text" },
  { name: "volumeOrWeight", label: "Həcm/çəki", type: "number" },
  { name: "color", label: "Rəng", type: "text" },
  { name: "brandCountry", label: "Brendin ölkəsi", type: "text" }
];

const lipstickTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "series", label: "Seriya", type: "text" },
  { name: "purpose", label: "Təyinat", type: "text" },
  { name: "type", label: "Növ", type: "text" },
  { name: "volumeOrWeight", label: "Həcm/çəki", type: "number" },
  { name: "color", label: "Rəng", type: "text" },
  { name: "brandCountry", label: "Brendin ölkəsi", type: "text" }
];

const standardProductTemplate: TemplateField[] = [
  { name: "productNumber", label: "Product №", type: "text" },
  { name: "series", label: "Seriya", type: "text" },
  { name: "purpose", label: "Təyinat", type: "text" },
  { name: "type", label: "Növ", type: "text" },
  { name: "volumeOrWeight", label: "Həcm/çəki", type: "number" },
  { name: "color", label: "Rəng", type: "text" },
  { name: "brandCountry", label: "Brendin ölkəsi", type: "text" }
];

export { standardProductTemplate, browProductTemplate, browShadowTemplate, browFixatorTemplate, toothpasteTemplate, facePowderTemplate, eyeShadowTemplate, lipstickTemplate }