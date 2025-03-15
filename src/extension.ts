import * as vscode from 'vscode';
import * as css from 'css';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('css-code-ordered.formatCSS', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'css') {
            const document = editor.document;
            try {
                const text = document.getText();
                const stylesheet = css.parse(text);
                const propertyGroups = {
                    positioning: ['position', 'top', 'right', 'bottom', 'left', 'z-index'],
                    boxModel: ['display', 'box-sizing', 'float', 'clear', 'overflow', 'overflow-x', 'overflow-y'],
                    flexboxGrid: ['flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'justify-content', 'align-items', 'align-content', 'align-self', 'order', 'gap'],
                    dimensions: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'inline-size', 'block-size'],
                    margins: ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'margin-inline', 'margin-block'],
                    padding: ['padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'padding-inline', 'padding-block'],
                    borders: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-width', 'border-style', 'border-color', 'border-radius'],
                    backgrounds: ['background', 'background-color', 'background-image', 'background-position', 'background-size', 'background-repeat'],
                    typography: ['font', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'text-align', 'text-decoration', 'text-transform'],
                    colorsEffects: ['color', 'opacity', 'box-shadow', 'text-shadow'],
                    transitionsAnimations: ['transition', 'animation', 'animation-name', 'animation-duration', 'animation-timing-function'],
                    interactivity: ['cursor', 'pointer-events', 'user-select']
                };

                let formattedText = '';
                stylesheet.stylesheet.rules.forEach((rule: css.Rule) => {
                    if (rule.type === 'rule' && rule.selectors) {
                        formattedText += `${rule.selectors.join(', ')} {\n`;
                        const properties = rule.declarations.filter((decl: css.Declaration) => decl.type === 'declaration');
                        formattedText += sortProperties(properties, propertyGroups);
                        formattedText += '}\n\n';
                    }
                });

                const edit = new vscode.WorkspaceEdit();
                const range = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(text.length)
                );
                edit.replace(document.uri, range, formattedText.trim());
                await vscode.workspace.applyEdit(edit);

                vscode.window.showInformationMessage('¡CSS formateado con éxito!');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage('Error al formatear CSS: ' + errorMessage);
            }
        } else {
            vscode.window.showErrorMessage('No hay un archivo CSS abierto.');
        }
    });

    const onSave = vscode.workspace.onWillSaveTextDocument(async (event) => {
        const document = event.document;
        if (document.languageId === 'css') {
            try {
                const text = document.getText();
                const stylesheet = css.parse(text);
                const propertyGroups = {
                    positioning: ['position', 'top', 'right', 'bottom', 'left', 'z-index'],
                    boxModel: ['display', 'box-sizing', 'float', 'clear', 'overflow', 'overflow-x', 'overflow-y'],
                    flexboxGrid: ['flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'justify-content', 'align-items', 'align-content', 'align-self', 'order', 'gap'],
                    dimensions: ['width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'inline-size', 'block-size'],
                    margins: ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'margin-inline', 'margin-block'],
                    padding: ['padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'padding-inline', 'padding-block'],
                    borders: ['border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-width', 'border-style', 'border-color', 'border-radius'],
                    backgrounds: ['background', 'background-color', 'background-image', 'background-position', 'background-size', 'background-repeat'],
                    typography: ['font', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'text-align', 'text-decoration', 'text-transform'],
                    colorsEffects: ['color', 'opacity', 'box-shadow', 'text-shadow'],
                    transitionsAnimations: ['transition', 'animation', 'animation-name', 'animation-duration', 'animation-timing-function'],
                    interactivity: ['cursor', 'pointer-events', 'user-select']
                };

                let formattedText = '';
                stylesheet.stylesheet.rules.forEach((rule: css.Rule) => {
                    if (rule.type === 'rule' && rule.selectors) {
                        formattedText += `${rule.selectors.join(', ')} {\n`;
                        const properties = rule.declarations.filter((decl: css.Declaration) => decl.type === 'declaration');
                        formattedText += sortProperties(properties, propertyGroups);
                        formattedText += '}\n\n';
                    }
                });

                const edit = new vscode.WorkspaceEdit();
                const range = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(text.length)
                );
                edit.replace(document.uri, range, formattedText.trim());
                await vscode.workspace.applyEdit(edit);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage('Error al formatear CSS al guardar: ' + errorMessage);
            }
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(onSave);
}

function sortProperties(properties: css.Declaration[], groups: any): string {
    const grouped: { [key: string]: css.Declaration[] } = {};
    const ungrouped: css.Declaration[] = [];

    // Obtener la configuración
    const config = vscode.workspace.getConfiguration('cssCodeOrdered');
    const sortAlphabetically = config.get('sortAlphabetically', true);

    // Clasificar propiedades en grupos o dejarlas sin grupo
    properties.forEach(prop => {
        let found = false;
        for (const group in groups) {
            if (groups[group].includes(prop.property)) {
                if (!grouped[group]) {
                    grouped[group] = [];
                }
                grouped[group].push(prop);
                found = true;
                break;
            }
        }
        if (!found) {
            ungrouped.push(prop);
        }
    });

    // Definir el orden de los grupos con descripciones
    const orderedGroups = [
        { name: 'positioning', comment: '/* Posicionamiento */' },
        { name: 'boxModel', comment: '/* Modelo de caja */' },
        { name: 'flexboxGrid', comment: '/* Flexbox y Grid */' },
        { name: 'dimensions', comment: '/* Dimensiones */' },
        { name: 'margins', comment: '/* Márgenes */' },
        { name: 'padding', comment: '/* Relleno */' },
        { name: 'borders', comment: '/* Bordes */' },
        { name: 'backgrounds', comment: '/* Fondos */' },
        { name: 'typography', comment: '/* Tipografía */' },
        { name: 'colorsEffects', comment: '/* Colores y efectos */' },
        { name: 'transitionsAnimations', comment: '/* Transiciones y animaciones */' },
        { name: 'interactivity', comment: '/* Interactividad */' }
    ];

    // Construir el CSS con comentarios
    let cssOutput = '';
    orderedGroups.forEach(group => {
        if (grouped[group.name] && grouped[group.name].length > 0) {
            cssOutput += `  ${group.comment}\n`;
            let groupProperties = grouped[group.name];
            if (sortAlphabetically) {
                groupProperties = groupProperties.sort((a, b) => a.property.localeCompare(b.property));
            }
            groupProperties.forEach(prop => {
                cssOutput += `  ${prop.property}: ${prop.value};\n`;
            });
            cssOutput += '\n';
        }
    });

    // Añadir propiedades no agrupadas al final
    if (ungrouped.length > 0) {
        cssOutput += '  /* Otras propiedades */\n';
        if (sortAlphabetically) {
            ungrouped.sort((a, b) => a.property.localeCompare(b.property));
        }
        ungrouped.forEach(prop => {
            cssOutput += `  ${prop.property}: ${prop.value};\n`;
        });
    }

    return cssOutput.trim();
}

export function deactivate() {}