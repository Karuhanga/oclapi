export interface VerboseContainer {
    type: string,
    uuid: string,
    id: string,
    external_id: string,
    short_code: string,
    name: string,
    full_name: string,
    collection_type: string,
    public_access: string,
    supported_locales: string[],
    website: string,
    description: string,
    extras: object,
    url: string,
    active_concepts: number,
    active_mappings: number,
    concepts_url: string,
    created_by: string,
}
