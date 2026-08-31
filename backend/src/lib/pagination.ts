type CursorClause = { skip: number; cursor: { id: string } } | {};

export const getPaginationParams = (
    limit: unknown,
    cursor: unknown,
    defaultLimit: number,
    maxLimit: number
): { take: number; cursorClause: CursorClause } => {
    let take = defaultLimit;
    if (typeof limit === "string") {
        const parsedLimit = Number(limit);
        if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
            take = Math.min(parsedLimit, maxLimit);
        }
    }

    const cursorClause: CursorClause =
        typeof cursor === "string" ? { skip: 1, cursor: { id: cursor } } : {};

    return { take, cursorClause };
};

export const getNextCursor = <T extends { id: string }>(
    items: T[],
    take: number
): string | null => {
    return items.length === take ? items[items.length - 1]!.id : null;
};
