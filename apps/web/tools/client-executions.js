// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pascalCase } = require("change-case");

module.exports = {
    plugin(schema, documents) {
        let results = [];
        for (const { document } of documents) {
            for (const definition of document.definitions) {
                if (!(definition.kind === "OperationDefinition" && definition.operation === "query")) {
                    continue;
                }

                const { name } = definition;
                const queryName = pascalCase(name.value);
                const result = `
export function query${queryName}(client: Apollo.ApolloClient<object>, options?: Omit<Apollo.QueryOptions<${queryName}QueryVariables, ${queryName}Query>, "query">) {
    return client.query<${queryName}Query, ${queryName}QueryVariables>({
        query: ${queryName}Document,
        ...options,
    });
}
                `.trim();

                results.push(result);
            }
        }

        return results.join("\n\n");
    },
};
