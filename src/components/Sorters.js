const ThumbViewSorters = {
  album: [
    {
      Label: 'Title',
      Field: 'Name',
      isNaN: !0,
      isActive: !0,
      isASC: -1
    },
    {
      Label: 'Artist',
      Field: 'artistName',
      isNaN: !0,
      isASC: -1
    },
    {
      Label: 'Track Count',
      Field: 'trackCount',
      isActive: !1,
      isNaN: !1,
      isASC: -1
    },
  ],
  artist: [
    {
      Label: 'Artist Name',
      Field: 'Name',
      isNaN: !0,
      isActive: !0,
      isASC: -1
    },
    {
      Label: 'Album Count',
      Field: 'albumCount',
      isNaN: !1,
      isASC: -1
    },
    {
      Label: 'Track Count',
      Field: 'trackCount',
      isActive: !1,
      isNaN: !1,
      isASC: -1
    },
  ],
  genre: [
    {
      Label: 'Title',
      Field: 'Name',
      isNaN: !0,
      isActive: !0,
      isASC: -1
    },
    {
      Label: 'Track Count',
      Field: 'Count',
      isActive: !1,
      isNaN: !1,
      isASC: -1
    },
  ],

  playlist: [
    {
      Label: 'Name',
      Field: 'Title',
      isNaN: !0,
      isActive: !0,
      isASC: -1
    },
    {
      Label: 'Track Count',
      Field: 'trackCount',
      isActive: !1,
      isNaN: !1,
      isASC: -1
    },
  ]
}

export {
  ThumbViewSorters
}