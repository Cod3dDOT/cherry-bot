CREATE VIEW "CurrentEmojiStatus" AS
SELECT
    s."emojiId",
    s."status"
FROM "EmojiStatusEvent" AS s
JOIN (
    SELECT
        "emojiId",
        MAX("eventId") AS "eventId"
    FROM "EmojiStatusEvent"
    GROUP BY "emojiId"
) AS latest
    ON s."eventId" = latest."eventId";

CREATE VIEW "CurrentUserStatus" AS
SELECT
    s."userId",
    s."guildId",
    s."status"
FROM "UserStatusEvent" AS s
JOIN (
    SELECT
        "userId",
        "guildId",
        MAX("eventId") AS "eventId"
    FROM "UserStatusEvent"
    GROUP BY "userId", "guildId"
) AS latest
    ON s."eventId" = latest."eventId";
