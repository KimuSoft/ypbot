with _first as (
  select "id"
  from "Rule"
  where exists (
      select
      from "__ruleOnChannel"
      where "A" = $1
        and "B" = "id" -- 채널
    )
    or exists (
      select
      from "__ruleOnGuild"
      where "A" = $2
        and "B" = "id" -- 서버
    )
),
_second as (
  select "id"
  from "Rule" as r
  where exists (
      select
      from _first as f
      where f."id" = r."id"
    )
    or exists (
      select
      from "Rule" as r2
      where exists (
          select
          from "__ruleReferences" as "_ref"
          where _ref."A" = r."id"
            and _ref."B" = r2."id"
        )
    )
),
_elements as (
  select "id",
    "name",
    "ruleType",
    "regex",
    "separate",
    (
      case
        "separate"
        when TRUE then $3 -- 분리된거
        else $4 -- 분리안된거
      end
    ) as "_Keyword"
  from "RuleElement" as r
  where exists (
      select
      from "_second" as _s
      where _s."id" = r."ruleId"
    )
)
select "id",
  "name",
  "ruleType",
  "regex",
  "separate"
from _elements as r
where (
    (
      r."ruleType" = 'White'::"RuleType"
      and r."regex" ~* "_Keyword"
    )
    or (
      r."ruleType" = 'Black'::"RuleType"
      and not r."regex" ~* "_Keyword"
    )
  )
limit 1