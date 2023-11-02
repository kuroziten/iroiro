item1:
  type: object
  properties: 
    item1_1:
      type: string
    item1_2:
      type: array
      items:
        type: object
        properties:
          item1_2_1:
            type: string
    item1_3:
      type: object
      properties:
        item1_3_1:
          type: string


let data = 
`
    アイテム１
      アイテム１＿１
        アイテム１＿１＿１
          アイテム１＿１＿１＿１
        アイテム１＿１＿２
      アイテム１＿２
        アイテム１＿２＿１
    アイテム２
        アイテム２＿１
`;

/*
こうしたい
アイテム１
アイテム１．アイテム１＿１
アイテム１．アイテム１＿１．アイテム１＿１＿１
アイテム１．アイテム１＿１．アイテム１＿１＿１．アイテム１＿１＿１＿１
アイテム１．アイテム１＿１．アイテム１＿１＿２
アイテム１．アイテム１＿２
アイテム１．アイテム１＿２．アイテム１＿２＿１
アイテム２
アイテム２．アイテム２＿１
*/
