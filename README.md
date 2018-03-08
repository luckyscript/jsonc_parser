# JSON_with_comments_Parser

## use

```
npm install json_with_comments_parser

import { parser } from 'json_with_comments_parser'

parser('{"a": "b"}')
```

## examples

parser(`{
            "a":"b" //comment
        }`)

// [{"key":"a","children":"\"b\"","value":"\"b\"","type":"string","description":"comment"}]

## TODO:
1. parser ArrayLike json [finish]
2. comment parser bugs fix [finish]
3. support mutiline comments
