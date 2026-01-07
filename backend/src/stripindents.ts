// for removing indentation taken from bold.new github 

export function stripIndents(value: string): string;
export function stripIndents(strings: TemplateStringsArray, ...values: any[]): string;
export function stripIndents(arg0: string | TemplateStringsArray, ...values: any[]): string {
    if (typeof arg0 !== 'string') {
        const processedString = arg0.reduce((acc, curr, i) => {
            return acc + curr + (values[i] ?? '');
        }, '');
        return removeIndentation(processedString);
    }
    return removeIndentation(arg0);
}

function removeIndentation(value: string): string {
    return value
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trimStart()
        .replace(/[\r\n]$/, '');
}
