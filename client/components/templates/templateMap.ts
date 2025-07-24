import { TemplateField } from "@/types/templates/template";
import { browFixatorTemplate, browProductTemplate, browShadowTemplate, eyeShadowTemplate, facePowderTemplate, lipstickTemplate, standardProductTemplate, toothpasteTemplate } from "./template";

export const templateMap: Record<string, TemplateField[]> = {
    "qas-qelemi": browProductTemplate,
    "qas-kontur-gel": browShadowTemplate,
    "qas-fiksatoru": browFixatorTemplate,
    "dis-macunu": toothpasteTemplate,
    "uzaqdan-toz": facePowderTemplate,
    "goz-kontur": eyeShadowTemplate,
    "pomada": lipstickTemplate,
    "standart-mehsul": standardProductTemplate,
};