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
      from _first as r2
      where exists (
          select
          from "__ruleReferences" as "_ref"
          where _ref."A" = r."id"
            and _ref."B" = r2."id"
        )
    )
  union all
  select *
  from _first
),
_elements as (
  select "id",
    "name",
    "ruleType",
    "regex",
    "separate",
    "ruleId",
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
),
_matches as (
  select r."id",
    r."name",
    r."ruleType",
    r."regex",
    r."separate",
    r."ruleId",
    r."_Keyword" ~* normalize(r."regex", nfkc) as "_Match"
  from _elements as r
)
select r."name",
  r."ruleType",
  normalize(r."regex", nfkc) as regex,
  r."separate",
  rule."name" as "ruleName"
from _matches as r
  right join "Rule" rule on r."ruleId" = rule."id"
where (
    (
      r."ruleType" = 'White'::"RuleType"
      and not "_Match"
    )
    or (
      r."ruleType" = 'Black'::"RuleType"
      and "_Match"
    )
  )
limit 1