function loadEBirdCalls(taxa_ids) {
  // set taxon_obs
  const filteredEntries = Object.entries(eBirdCalls).filter(
    ([taxon_id, obs_list]) => taxa_ids.includes(Number(taxon_id))
  );
  taxon_obs = Object.fromEntries(filteredEntries);

  // make sure all taxa have keys
  const taxaWithoutData = [];
  for (const id of taxa_ids) {
    if (!(id in taxon_obs)) {
      taxaWithoutData.push(id);
      taxon_obs[id] = [];
    }
  }

  // fill in taxon object information
  const taxonObjects = Object.fromEntries(
    list_taxa.map((obj) => [obj.id, JSON.parse(JSON.stringify(obj))])
  );
  // need to add the species taxa level to ancestor ids b/c we're using the main taxon object,
  // not the taxon object that iNaturalist usually attaches to observations
  for (const obj of Object.values(taxonObjects)) {
    obj.ancestor_ids.push(obj.id);
  }
  // assign taxon objects appropriately
  for (const obs_list of Object.values(taxon_obs)) {
    for (const obs of obs_list) {
      obs.taxon = taxonObjects[obs.taxon_id];
    }
  }

  // set taxon_queues
  for (const taxon_id in taxon_obs) {
    taxon_queues[taxon_id] = taxon_obs[taxon_id].slice();
  }

  // warn the user about taxa without data
  const failedNames = taxaWithoutData.map(
    (id) => taxonObjects[id].preferred_common_name
  );
  if (failedNames.length > 0) {
    alert(
      "No bird call data is available for: " +
        failedNames.join(", ") +
        ". This doesn't break anything, just no questions will be about these species."
    );
  }
}

const eBirdCalls = {
  12727: [
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML207166",
      uri: "https://macaulaylibrary.org/asset/207166",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/207166/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML415777801",
      uri: "https://macaulaylibrary.org/asset/415777801",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/415777801/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML204805",
      uri: "https://macaulaylibrary.org/asset/204805",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/204805/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML306069",
      uri: "https://macaulaylibrary.org/asset/306069",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306069/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML611595553",
      uri: "https://macaulaylibrary.org/asset/611595553",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/611595553/mp3",
          attribution: "(c) Ethan Denton",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML146906501",
      uri: "https://macaulaylibrary.org/asset/146906501",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/146906501/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML594251411",
      uri: "https://macaulaylibrary.org/asset/594251411",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/594251411/mp3",
          attribution: "(c) Vyom Vyas",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML521892051",
      uri: "https://macaulaylibrary.org/asset/521892051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/521892051/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML213807211",
      uri: "https://macaulaylibrary.org/asset/213807211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/213807211/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML231833231",
      uri: "https://macaulaylibrary.org/asset/231833231",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/231833231/mp3",
          attribution: "(c) Miguel Aguilar @birdnomad",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML24987211",
      uri: "https://macaulaylibrary.org/asset/24987211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/24987211/mp3",
          attribution: "(c) Mike Bailey",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML207168",
      uri: "https://macaulaylibrary.org/asset/207168",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/207168/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML143830221",
      uri: "https://macaulaylibrary.org/asset/143830221",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/143830221/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML464429961",
      uri: "https://macaulaylibrary.org/asset/464429961",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/464429961/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 12727,
      common_name: "American Robin",
      id: "ML349365251",
      uri: "https://macaulaylibrary.org/asset/349365251",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/349365251/mp3",
          attribution: "(c) Sawyer Dawson",
        },
      ],
    },
  ],
  144814: [
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML218789301",
      uri: "https://macaulaylibrary.org/asset/218789301",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/218789301/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML306058",
      uri: "https://macaulaylibrary.org/asset/306058",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306058/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML342303351",
      uri: "https://macaulaylibrary.org/asset/342303351",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/342303351/mp3",
          attribution: "(c) Mike Austin",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML519132201",
      uri: "https://macaulaylibrary.org/asset/519132201",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/519132201/mp3",
          attribution: "(c) Ethan Kang",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML226854471",
      uri: "https://macaulaylibrary.org/asset/226854471",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/226854471/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML288407931",
      uri: "https://macaulaylibrary.org/asset/288407931",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/288407931/mp3",
          attribution: "(c) Ryan O'Donnell",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML67149831",
      uri: "https://macaulaylibrary.org/asset/67149831",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/67149831/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML89100571",
      uri: "https://macaulaylibrary.org/asset/89100571",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/89100571/mp3",
          attribution: "(c) David Gibson",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML41694461",
      uri: "https://macaulaylibrary.org/asset/41694461",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/41694461/mp3",
          attribution: "(c) Colin Sumrall",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML356123491",
      uri: "https://macaulaylibrary.org/asset/356123491",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/356123491/mp3",
          attribution: "(c) Jason Vassallo",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML292118321",
      uri: "https://macaulaylibrary.org/asset/292118321",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/292118321/mp3",
          attribution: "(c) Matt Wistrand",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML617995262",
      uri: "https://macaulaylibrary.org/asset/617995262",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/617995262/mp3",
          attribution: "(c) Julia Plummer",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML354647421",
      uri: "https://macaulaylibrary.org/asset/354647421",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/354647421/mp3",
          attribution: "(c) Jonathan Layman",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML150967531",
      uri: "https://macaulaylibrary.org/asset/150967531",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/150967531/mp3",
          attribution: "(c) Guy McGrane",
        },
      ],
    },
    {
      taxon_id: 144814,
      common_name: "Carolina Chickadee",
      id: "ML539855",
      uri: "https://macaulaylibrary.org/asset/539855",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539855/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
  ],
  13632: [
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML316656171",
      uri: "https://macaulaylibrary.org/asset/316656171",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/316656171/mp3",
          attribution: "(c) Chris Wood",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML619644408",
      uri: "https://macaulaylibrary.org/asset/619644408",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/619644408/mp3",
          attribution: "(c) Gavin Aquila",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML239212",
      uri: "https://macaulaylibrary.org/asset/239212",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/239212/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML239211",
      uri: "https://macaulaylibrary.org/asset/239211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/239211/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML384288261",
      uri: "https://macaulaylibrary.org/asset/384288261",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/384288261/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML314085811",
      uri: "https://macaulaylibrary.org/asset/314085811",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/314085811/mp3",
          attribution: "(c) Jefferson Shank",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML539623",
      uri: "https://macaulaylibrary.org/asset/539623",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539623/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML375341691",
      uri: "https://macaulaylibrary.org/asset/375341691",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/375341691/mp3",
          attribution: "(c) Ryan O'Donnell",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML91350821",
      uri: "https://macaulaylibrary.org/asset/91350821",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/91350821/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML485244651",
      uri: "https://macaulaylibrary.org/asset/485244651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/485244651/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML455282611",
      uri: "https://macaulaylibrary.org/asset/455282611",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/455282611/mp3",
          attribution: "(c) Andrew W.",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML149702811",
      uri: "https://macaulaylibrary.org/asset/149702811",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/149702811/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML115680171",
      uri: "https://macaulaylibrary.org/asset/115680171",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/115680171/mp3",
          attribution: "(c) Jim Ferrari",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML330833881",
      uri: "https://macaulaylibrary.org/asset/330833881",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/330833881/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML326676501",
      uri: "https://macaulaylibrary.org/asset/326676501",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/326676501/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
  ],
  9135: [
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML436602761",
      uri: "https://macaulaylibrary.org/asset/436602761",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/436602761/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML620678027",
      uri: "https://macaulaylibrary.org/asset/620678027",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/620678027/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML577914641",
      uri: "https://macaulaylibrary.org/asset/577914641",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/577914641/mp3",
          attribution: "(c) Enrique Mej\u00eda",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML436601991",
      uri: "https://macaulaylibrary.org/asset/436601991",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/436601991/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML613993451",
      uri: "https://macaulaylibrary.org/asset/613993451",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/613993451/mp3",
          attribution: "(c) Amy Swarr",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML358822021",
      uri: "https://macaulaylibrary.org/asset/358822021",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/358822021/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML534483",
      uri: "https://macaulaylibrary.org/asset/534483",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/534483/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML249183051",
      uri: "https://macaulaylibrary.org/asset/249183051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/249183051/mp3",
          attribution: "(c) Laura Sebastianelli",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML232104111",
      uri: "https://macaulaylibrary.org/asset/232104111",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/232104111/mp3",
          attribution: "(c) Magdalena Z",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML620678118",
      uri: "https://macaulaylibrary.org/asset/620678118",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/620678118/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML168439961",
      uri: "https://macaulaylibrary.org/asset/168439961",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/168439961/mp3",
          attribution: "(c) Subramanian Sankar",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML27605311",
      uri: "https://macaulaylibrary.org/asset/27605311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/27605311/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML157421181",
      uri: "https://macaulaylibrary.org/asset/157421181",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/157421181/mp3",
          attribution: "(c) LynnErla Beegle",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML118565241",
      uri: "https://macaulaylibrary.org/asset/118565241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/118565241/mp3",
          attribution: "(c) Nick Kiehl",
        },
      ],
    },
    {
      taxon_id: 9135,
      common_name: "Chipping Sparrow",
      id: "ML30946131",
      uri: "https://macaulaylibrary.org/asset/30946131",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/30946131/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
  ],
  199840: [
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML358484801",
      uri: "https://macaulaylibrary.org/asset/358484801",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/358484801/mp3",
          attribution: "(c) Ben Johnson",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML237013",
      uri: "https://macaulaylibrary.org/asset/237013",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/237013/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML110958961",
      uri: "https://macaulaylibrary.org/asset/110958961",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/110958961/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML53074001",
      uri: "https://macaulaylibrary.org/asset/53074001",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/53074001/mp3",
          attribution: "(c) Ken Chamberlain",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML357620731",
      uri: "https://macaulaylibrary.org/asset/357620731",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/357620731/mp3",
          attribution: "(c) Gavin Aquila",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML71304501",
      uri: "https://macaulaylibrary.org/asset/71304501",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/71304501/mp3",
          attribution: "(c) Pat Goltz",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML225354721",
      uri: "https://macaulaylibrary.org/asset/225354721",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/225354721/mp3",
          attribution: "(c) Pat Goltz",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML143859871",
      uri: "https://macaulaylibrary.org/asset/143859871",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/143859871/mp3",
          attribution: "(c) Richard Littauer",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML147915021",
      uri: "https://macaulaylibrary.org/asset/147915021",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/147915021/mp3",
          attribution: "(c) Jordan P",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML216092791",
      uri: "https://macaulaylibrary.org/asset/216092791",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/216092791/mp3",
          attribution: "(c) I'm Birding Right Now (Teresa & Miles Tuffli)",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML190647911",
      uri: "https://macaulaylibrary.org/asset/190647911",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/190647911/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML85128421",
      uri: "https://macaulaylibrary.org/asset/85128421",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/85128421/mp3",
          attribution: "(c) Robert Bochenek",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML508223701",
      uri: "https://macaulaylibrary.org/asset/508223701",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/508223701/mp3",
          attribution: "(c) Liam Ragan",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML191569311",
      uri: "https://macaulaylibrary.org/asset/191569311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/191569311/mp3",
          attribution: "(c) valerie heemstra",
        },
      ],
    },
    {
      taxon_id: 199840,
      common_name: "House Finch",
      id: "ML172911231",
      uri: "https://macaulaylibrary.org/asset/172911231",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/172911231/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
  ],
  14825: [
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML325326011",
      uri: "https://macaulaylibrary.org/asset/325326011",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/325326011/mp3",
          attribution: "(c) LynnErla Beegle",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML92752291",
      uri: "https://macaulaylibrary.org/asset/92752291",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/92752291/mp3",
          attribution: "(c) Steve Raduns",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML83615711",
      uri: "https://macaulaylibrary.org/asset/83615711",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/83615711/mp3",
          attribution: "(c) Mark R Johnson",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML156602261",
      uri: "https://macaulaylibrary.org/asset/156602261",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/156602261/mp3",
          attribution: "(c) Marilyn Westphal",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML112237851",
      uri: "https://macaulaylibrary.org/asset/112237851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/112237851/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML57525031",
      uri: "https://macaulaylibrary.org/asset/57525031",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/57525031/mp3",
          attribution: "(c) Eric Cormier",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML72123081",
      uri: "https://macaulaylibrary.org/asset/72123081",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/72123081/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML28346041",
      uri: "https://macaulaylibrary.org/asset/28346041",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/28346041/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML65961851",
      uri: "https://macaulaylibrary.org/asset/65961851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/65961851/mp3",
          attribution: "(c) Jim Ferrari",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML620408169",
      uri: "https://macaulaylibrary.org/asset/620408169",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/620408169/mp3",
          attribution: "(c) Marcos Eug\u00eanio (Birding Guide)",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML64458181",
      uri: "https://macaulaylibrary.org/asset/64458181",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/64458181/mp3",
          attribution: "(c) Anne Thompson",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML623289251",
      uri: "https://macaulaylibrary.org/asset/623289251",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/623289251/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML612054983",
      uri: "https://macaulaylibrary.org/asset/612054983",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/612054983/mp3",
          attribution: "(c) LynnErla Beegle",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML102749701",
      uri: "https://macaulaylibrary.org/asset/102749701",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/102749701/mp3",
          attribution: "(c) LynnErla Beegle",
        },
      ],
    },
    {
      taxon_id: 14825,
      common_name: "Brown-headed Nuthatch",
      id: "ML120782681",
      uri: "https://macaulaylibrary.org/asset/120782681",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/120782681/mp3",
          attribution: "(c) Robert Dobbs",
        },
      ],
    },
  ],
  14886: [
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML451232651",
      uri: "https://macaulaylibrary.org/asset/451232651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/451232651/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML523915721",
      uri: "https://macaulaylibrary.org/asset/523915721",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/523915721/mp3",
          attribution: "(c) James Remsen",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML160887431",
      uri: "https://macaulaylibrary.org/asset/160887431",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/160887431/mp3",
          attribution: "(c) Ronan Nicholson",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML549926681",
      uri: "https://macaulaylibrary.org/asset/549926681",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/549926681/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML203887251",
      uri: "https://macaulaylibrary.org/asset/203887251",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203887251/mp3",
          attribution: "(c) Joe Angseesing",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML391237391",
      uri: "https://macaulaylibrary.org/asset/391237391",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/391237391/mp3",
          attribution: "(c) Lisa Cancade Hackett",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML160702331",
      uri: "https://macaulaylibrary.org/asset/160702331",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/160702331/mp3",
          attribution: "(c) Ronan Nicholson",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML29565001",
      uri: "https://macaulaylibrary.org/asset/29565001",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/29565001/mp3",
          attribution: "(c) Rafael Vergara",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML97649901",
      uri: "https://macaulaylibrary.org/asset/97649901",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/97649901/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML627136933",
      uri: "https://macaulaylibrary.org/asset/627136933",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/627136933/mp3",
          attribution: "(c) Kriss Replogle",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML461055861",
      uri: "https://macaulaylibrary.org/asset/461055861",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/461055861/mp3",
          attribution: "(c) Alex Lin-Moore",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML203918441",
      uri: "https://macaulaylibrary.org/asset/203918441",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203918441/mp3",
          attribution: "(c) Josep del Hoyo",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML239201",
      uri: "https://macaulaylibrary.org/asset/239201",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/239201/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML292453501",
      uri: "https://macaulaylibrary.org/asset/292453501",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/292453501/mp3",
          attribution: "(c) Julia Plummer",
        },
      ],
    },
    {
      taxon_id: 14886,
      common_name: "Northern Mockingbird",
      id: "ML20601691",
      uri: "https://macaulaylibrary.org/asset/20601691",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/20601691/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
  ],
  14801: [
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML306062",
      uri: "https://macaulaylibrary.org/asset/306062",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306062/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML306053",
      uri: "https://macaulaylibrary.org/asset/306053",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306053/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML45982091",
      uri: "https://macaulaylibrary.org/asset/45982091",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/45982091/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML304498191",
      uri: "https://macaulaylibrary.org/asset/304498191",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/304498191/mp3",
          attribution: "(c) Magdalena Z",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML143392551",
      uri: "https://macaulaylibrary.org/asset/143392551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/143392551/mp3",
          attribution: "(c) Fran\u00e7ois Martin",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML372181931",
      uri: "https://macaulaylibrary.org/asset/372181931",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/372181931/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML170192481",
      uri: "https://macaulaylibrary.org/asset/170192481",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/170192481/mp3",
          attribution: "(c) Kent Fiala",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML135426821",
      uri: "https://macaulaylibrary.org/asset/135426821",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/135426821/mp3",
          attribution: "(c) Bates Estabrooks",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML83345991",
      uri: "https://macaulaylibrary.org/asset/83345991",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/83345991/mp3",
          attribution: "(c) Paul Suchanek",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML306063",
      uri: "https://macaulaylibrary.org/asset/306063",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306063/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML306061",
      uri: "https://macaulaylibrary.org/asset/306061",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306061/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML306057",
      uri: "https://macaulaylibrary.org/asset/306057",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306057/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML306056",
      uri: "https://macaulaylibrary.org/asset/306056",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306056/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML306055",
      uri: "https://macaulaylibrary.org/asset/306055",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306055/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 14801,
      common_name: "White-breasted Nuthatch",
      id: "ML153592081",
      uri: "https://macaulaylibrary.org/asset/153592081",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/153592081/mp3",
          attribution: "(c) Richard Ackley",
        },
      ],
    },
  ],
  145310: [
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML104680001",
      uri: "https://macaulaylibrary.org/asset/104680001",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/104680001/mp3",
          attribution: "(c) Mark Dennis",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML384917621",
      uri: "https://macaulaylibrary.org/asset/384917621",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/384917621/mp3",
          attribution: "(c) Julia Plummer",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML64266551",
      uri: "https://macaulaylibrary.org/asset/64266551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/64266551/mp3",
          attribution: "(c) William D. Kragh",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML259582191",
      uri: "https://macaulaylibrary.org/asset/259582191",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/259582191/mp3",
          attribution: "(c) Bruno Drolet",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML67989071",
      uri: "https://macaulaylibrary.org/asset/67989071",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/67989071/mp3",
          attribution: "(c) Ted Floyd",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML166996381",
      uri: "https://macaulaylibrary.org/asset/166996381",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/166996381/mp3",
          attribution: "(c) Christopher McPherson",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML609177252",
      uri: "https://macaulaylibrary.org/asset/609177252",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/609177252/mp3",
          attribution: "(c) Dargan Jaeger",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML324134951",
      uri: "https://macaulaylibrary.org/asset/324134951",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/324134951/mp3",
          attribution: "(c) Magdalena Z",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML252373981",
      uri: "https://macaulaylibrary.org/asset/252373981",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/252373981/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML27600351",
      uri: "https://macaulaylibrary.org/asset/27600351",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/27600351/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML214187261",
      uri: "https://macaulaylibrary.org/asset/214187261",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/214187261/mp3",
          attribution: "(c) Michael S Taylor",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML116299721",
      uri: "https://macaulaylibrary.org/asset/116299721",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/116299721/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML611520106",
      uri: "https://macaulaylibrary.org/asset/611520106",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/611520106/mp3",
          attribution: "(c) Carole Swann",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML589736571",
      uri: "https://macaulaylibrary.org/asset/589736571",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/589736571/mp3",
          attribution: "(c) Dioni Lo\u00efc Sauv\u00e9",
        },
      ],
    },
    {
      taxon_id: 145310,
      common_name: "American Goldfinch",
      id: "ML481715181",
      uri: "https://macaulaylibrary.org/asset/481715181",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/481715181/mp3",
          attribution: "(c) Richard Stanton",
        },
      ],
    },
  ],
  8021: [
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML104365511",
      uri: "https://macaulaylibrary.org/asset/104365511",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/104365511/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML56781051",
      uri: "https://macaulaylibrary.org/asset/56781051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/56781051/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML420980621",
      uri: "https://macaulaylibrary.org/asset/420980621",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/420980621/mp3",
          attribution: "(c) Paul Fenwick",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML72456501",
      uri: "https://macaulaylibrary.org/asset/72456501",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/72456501/mp3",
          attribution: "(c) Jeffrey Roth",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML295109331",
      uri: "https://macaulaylibrary.org/asset/295109331",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/295109331/mp3",
          attribution: "(c) Dan J. MacNeal",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML214721311",
      uri: "https://macaulaylibrary.org/asset/214721311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/214721311/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML165134801",
      uri: "https://macaulaylibrary.org/asset/165134801",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/165134801/mp3",
          attribution: "(c) Dave Slager",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML102495871",
      uri: "https://macaulaylibrary.org/asset/102495871",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/102495871/mp3",
          attribution: "(c) Ian Hearn",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML435550391",
      uri: "https://macaulaylibrary.org/asset/435550391",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/435550391/mp3",
          attribution: "(c) Jameson Koehn",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML105313241",
      uri: "https://macaulaylibrary.org/asset/105313241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/105313241/mp3",
          attribution: "(c) Chris Wood",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML207780",
      uri: "https://macaulaylibrary.org/asset/207780",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/207780/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML207778",
      uri: "https://macaulaylibrary.org/asset/207778",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/207778/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML167507991",
      uri: "https://macaulaylibrary.org/asset/167507991",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/167507991/mp3",
          attribution: "(c) Laura Sebastianelli",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML75754801",
      uri: "https://macaulaylibrary.org/asset/75754801",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/75754801/mp3",
          attribution: "(c) John Doty",
        },
      ],
    },
    {
      taxon_id: 8021,
      common_name: "American Crow",
      id: "ML91500411",
      uri: "https://macaulaylibrary.org/asset/91500411",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/91500411/mp3",
          attribution: "(c) Zoe McCormick",
        },
      ],
    },
  ],
  1289388: [
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML29982651",
      uri: "https://macaulaylibrary.org/asset/29982651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/29982651/mp3",
          attribution: "(c) Scott Olmstead",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML318745131",
      uri: "https://macaulaylibrary.org/asset/318745131",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/318745131/mp3",
          attribution: "(c) Matt Brady",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML136390651",
      uri: "https://macaulaylibrary.org/asset/136390651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/136390651/mp3",
          attribution: "(c) I'm Birding Right Now (Teresa & Miles Tuffli)",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML239741641",
      uri: "https://macaulaylibrary.org/asset/239741641",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/239741641/mp3",
          attribution: "(c) Alexander Lange",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML147088101",
      uri: "https://macaulaylibrary.org/asset/147088101",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/147088101/mp3",
          attribution: "(c) Robert Dobbs",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML124324011",
      uri: "https://macaulaylibrary.org/asset/124324011",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/124324011/mp3",
          attribution: "(c) Matt Brady",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML110158671",
      uri: "https://macaulaylibrary.org/asset/110158671",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/110158671/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML40611441",
      uri: "https://macaulaylibrary.org/asset/40611441",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/40611441/mp3",
          attribution: "(c) Colby Neuman",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML121846801",
      uri: "https://macaulaylibrary.org/asset/121846801",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/121846801/mp3",
          attribution: "(c) Michael S Taylor",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML40110051",
      uri: "https://macaulaylibrary.org/asset/40110051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/40110051/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML179144631",
      uri: "https://macaulaylibrary.org/asset/179144631",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/179144631/mp3",
          attribution: "(c) Asher Perla",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML154056311",
      uri: "https://macaulaylibrary.org/asset/154056311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/154056311/mp3",
          attribution: "(c) Jerred Seveyka",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML131086241",
      uri: "https://macaulaylibrary.org/asset/131086241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/131086241/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML128243941",
      uri: "https://macaulaylibrary.org/asset/128243941",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/128243941/mp3",
          attribution: "(c) Eric Zawatski",
        },
      ],
    },
    {
      taxon_id: 1289388,
      common_name: "Ruby-crowned Kinglet",
      id: "ML120977781",
      uri: "https://macaulaylibrary.org/asset/120977781",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/120977781/mp3",
          attribution: "(c) Brenton Reyner",
        },
      ],
    },
  ],
  19893: [
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML473499021",
      uri: "https://macaulaylibrary.org/asset/473499021",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/473499021/mp3",
          attribution: "(c) Taylor Sturm",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML473499011",
      uri: "https://macaulaylibrary.org/asset/473499011",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/473499011/mp3",
          attribution: "(c) Taylor Sturm",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML282032221",
      uri: "https://macaulaylibrary.org/asset/282032221",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/282032221/mp3",
          attribution: "(c) Nick Tepper",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML375694541",
      uri: "https://macaulaylibrary.org/asset/375694541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/375694541/mp3",
          attribution: "(c) Andr\u00e9 BERNARD",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML203918721",
      uri: "https://macaulaylibrary.org/asset/203918721",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203918721/mp3",
          attribution: "(c) Josep del Hoyo",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML238657631",
      uri: "https://macaulaylibrary.org/asset/238657631",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/238657631/mp3",
          attribution: "(c) Jeff Graham",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML76176331",
      uri: "https://macaulaylibrary.org/asset/76176331",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/76176331/mp3",
          attribution: "(c) Lance Benner",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML37500081",
      uri: "https://macaulaylibrary.org/asset/37500081",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/37500081/mp3",
          attribution: "(c) Steven Biggers",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML153850371",
      uri: "https://macaulaylibrary.org/asset/153850371",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/153850371/mp3",
          attribution: "(c) Andrew Simon",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML466021651",
      uri: "https://macaulaylibrary.org/asset/466021651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/466021651/mp3",
          attribution: "(c) Andrew Emlen",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML313379041",
      uri: "https://macaulaylibrary.org/asset/313379041",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/313379041/mp3",
          attribution: "(c) Gregg Friesen",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML244227411",
      uri: "https://macaulaylibrary.org/asset/244227411",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/244227411/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML218677441",
      uri: "https://macaulaylibrary.org/asset/218677441",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/218677441/mp3",
          attribution: "(c) Laura Sebastianelli",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML119268331",
      uri: "https://macaulaylibrary.org/asset/119268331",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/119268331/mp3",
          attribution: "(c) Steve Raduns",
        },
      ],
    },
    {
      taxon_id: 19893,
      common_name: "Barred Owl",
      id: "ML70041521",
      uri: "https://macaulaylibrary.org/asset/70041521",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/70041521/mp3",
          attribution: "(c) LynnErla Beegle",
        },
      ],
    },
  ],
  145245: [
    {
      taxon_id: 145245,
      common_name: "Yellow-rumped Warbler",
      id: "ML41731941",
      uri: "https://macaulaylibrary.org/asset/41731941",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/41731941/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 145245,
      common_name: "Yellow-rumped Warbler",
      id: "ML499222831",
      uri: "https://macaulaylibrary.org/asset/499222831",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/499222831/mp3",
          attribution: "(c) Ashley Hopkins",
        },
      ],
    },
    {
      taxon_id: 145245,
      common_name: "Yellow-rumped Warbler",
      id: "ML117532541",
      uri: "https://macaulaylibrary.org/asset/117532541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/117532541/mp3",
          attribution: "(c) valerie heemstra",
        },
      ],
    },
    {
      taxon_id: 145245,
      common_name: "Yellow-rumped Warbler",
      id: "ML74235021",
      uri: "https://macaulaylibrary.org/asset/74235021",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/74235021/mp3",
          attribution: "(c) David W Foster",
        },
      ],
    },
    {
      taxon_id: 145245,
      common_name: "Yellow-rumped Warbler",
      id: "ML151532241",
      uri: "https://macaulaylibrary.org/asset/151532241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/151532241/mp3",
          attribution: "(c) Thomas Anderson",
        },
      ],
    },
    {
      taxon_id: 145245,
      common_name: "Yellow-rumped Warbler",
      id: "ML90305051",
      uri: "https://macaulaylibrary.org/asset/90305051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/90305051/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 145245,
      common_name: "Yellow-rumped Warbler",
      id: "ML624358044",
      uri: "https://macaulaylibrary.org/asset/624358044",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/624358044/mp3",
          attribution: "(c) Glen Chapman",
        },
      ],
    },
  ],
  792988: [
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker (Eastern)",
      id: "ML539863",
      uri: "https://macaulaylibrary.org/asset/539863",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539863/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML367769351",
      uri: "https://macaulaylibrary.org/asset/367769351",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/367769351/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker (Eastern)",
      id: "ML147240231",
      uri: "https://macaulaylibrary.org/asset/147240231",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/147240231/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker (Eastern)",
      id: "ML100388531",
      uri: "https://macaulaylibrary.org/asset/100388531",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/100388531/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML124756741",
      uri: "https://macaulaylibrary.org/asset/124756741",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/124756741/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML259492221",
      uri: "https://macaulaylibrary.org/asset/259492221",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/259492221/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML145058041",
      uri: "https://macaulaylibrary.org/asset/145058041",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/145058041/mp3",
          attribution: "(c) Carole Swann",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker (Eastern)",
      id: "ML51878761",
      uri: "https://macaulaylibrary.org/asset/51878761",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/51878761/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML112147351",
      uri: "https://macaulaylibrary.org/asset/112147351",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/112147351/mp3",
          attribution: "(c) Noah H",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML96331681",
      uri: "https://macaulaylibrary.org/asset/96331681",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/96331681/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker (Eastern)",
      id: "ML539862",
      uri: "https://macaulaylibrary.org/asset/539862",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539862/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML95434931",
      uri: "https://macaulaylibrary.org/asset/95434931",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/95434931/mp3",
          attribution: "(c) Lateefah Williams",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML225497451",
      uri: "https://macaulaylibrary.org/asset/225497451",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/225497451/mp3",
          attribution: "(c) Germ Germain",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML203113971",
      uri: "https://macaulaylibrary.org/asset/203113971",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203113971/mp3",
          attribution: "(c) Julia Plummer",
        },
      ],
    },
    {
      taxon_id: 792988,
      common_name: "Downy Woodpecker",
      id: "ML94266441",
      uri: "https://macaulaylibrary.org/asset/94266441",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/94266441/mp3",
          attribution: "(c) Jocelyn Lauzon",
        },
      ],
    },
  ],
  18236: [
    {
      taxon_id: 18236,
      common_name: "Northern Flicker",
      id: "ML534481",
      uri: "https://macaulaylibrary.org/asset/534481",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/534481/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML409396031",
      uri: "https://macaulaylibrary.org/asset/409396031",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/409396031/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML590040831",
      uri: "https://macaulaylibrary.org/asset/590040831",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/590040831/mp3",
          attribution: "(c) Vyom Vyas",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker",
      id: "ML534491",
      uri: "https://macaulaylibrary.org/asset/534491",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/534491/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML608827017",
      uri: "https://macaulaylibrary.org/asset/608827017",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/608827017/mp3",
          attribution: "(c) Trenton Voytko",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker",
      id: "ML534480",
      uri: "https://macaulaylibrary.org/asset/534480",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/534480/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML227575171",
      uri: "https://macaulaylibrary.org/asset/227575171",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/227575171/mp3",
          attribution: "(c) Gordon Smith",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML534407",
      uri: "https://macaulaylibrary.org/asset/534407",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/534407/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML590123071",
      uri: "https://macaulaylibrary.org/asset/590123071",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/590123071/mp3",
          attribution: "(c) Vyom Vyas",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML96504551",
      uri: "https://macaulaylibrary.org/asset/96504551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/96504551/mp3",
          attribution: "(c) Robert Bochenek",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker",
      id: "ML279585611",
      uri: "https://macaulaylibrary.org/asset/279585611",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/279585611/mp3",
          attribution: "(c) Glen Chapman",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML31618581",
      uri: "https://macaulaylibrary.org/asset/31618581",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/31618581/mp3",
          attribution: "(c) Ian Davies",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker",
      id: "ML104842361",
      uri: "https://macaulaylibrary.org/asset/104842361",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/104842361/mp3",
          attribution: "(c) Ryan Keiffer",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker (Yellow-shafted)",
      id: "ML534408",
      uri: "https://macaulaylibrary.org/asset/534408",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/534408/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18236,
      common_name: "Northern Flicker",
      id: "ML171896461",
      uri: "https://macaulaylibrary.org/asset/171896461",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/171896461/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
  ],
  8229: [
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML421603721",
      uri: "https://macaulaylibrary.org/asset/421603721",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/421603721/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML260458751",
      uri: "https://macaulaylibrary.org/asset/260458751",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/260458751/mp3",
          attribution: "(c) Steven Mlodinow",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML548476381",
      uri: "https://macaulaylibrary.org/asset/548476381",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/548476381/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML507485491",
      uri: "https://macaulaylibrary.org/asset/507485491",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/507485491/mp3",
          attribution: "(c) Nathaniel Sharp",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML129697981",
      uri: "https://macaulaylibrary.org/asset/129697981",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/129697981/mp3",
          attribution: "(c) Dan J. MacNeal",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML264268971",
      uri: "https://macaulaylibrary.org/asset/264268971",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/264268971/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML318081001",
      uri: "https://macaulaylibrary.org/asset/318081001",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/318081001/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML124174381",
      uri: "https://macaulaylibrary.org/asset/124174381",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/124174381/mp3",
          attribution: "(c) Dan J. MacNeal",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML95369451",
      uri: "https://macaulaylibrary.org/asset/95369451",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/95369451/mp3",
          attribution: "(c) Lateefah Williams",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML322430471",
      uri: "https://macaulaylibrary.org/asset/322430471",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/322430471/mp3",
          attribution: "(c) Grace C",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML31287731",
      uri: "https://macaulaylibrary.org/asset/31287731",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/31287731/mp3",
          attribution: "(c) Jeff Graham",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML323074101",
      uri: "https://macaulaylibrary.org/asset/323074101",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/323074101/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML434838321",
      uri: "https://macaulaylibrary.org/asset/434838321",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/434838321/mp3",
          attribution: "(c) Dimitris Salas",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML88475111",
      uri: "https://macaulaylibrary.org/asset/88475111",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/88475111/mp3",
          attribution: "(c) Jean Cr\u00e9peau",
        },
      ],
    },
    {
      taxon_id: 8229,
      common_name: "Blue Jay",
      id: "ML629341432",
      uri: "https://macaulaylibrary.org/asset/629341432",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/629341432/mp3",
          attribution: "(c) Kriss Replogle",
        },
      ],
    },
  ],
  18205: [
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML306064",
      uri: "https://macaulaylibrary.org/asset/306064",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306064/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML246797061",
      uri: "https://macaulaylibrary.org/asset/246797061",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/246797061/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML410050981",
      uri: "https://macaulaylibrary.org/asset/410050981",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/410050981/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML230037631",
      uri: "https://macaulaylibrary.org/asset/230037631",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/230037631/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML97153371",
      uri: "https://macaulaylibrary.org/asset/97153371",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/97153371/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML323583411",
      uri: "https://macaulaylibrary.org/asset/323583411",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/323583411/mp3",
          attribution: "(c) Phoebe Barnes",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML56482251",
      uri: "https://macaulaylibrary.org/asset/56482251",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/56482251/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML216059301",
      uri: "https://macaulaylibrary.org/asset/216059301",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/216059301/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML408829051",
      uri: "https://macaulaylibrary.org/asset/408829051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/408829051/mp3",
          attribution: "(c) Kriss Replogle",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML306065",
      uri: "https://macaulaylibrary.org/asset/306065",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306065/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML580153031",
      uri: "https://macaulaylibrary.org/asset/580153031",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/580153031/mp3",
          attribution: "(c) Kent Fiala",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML553571521",
      uri: "https://macaulaylibrary.org/asset/553571521",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/553571521/mp3",
          attribution: "(c) Christopher McPherson",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML550500031",
      uri: "https://macaulaylibrary.org/asset/550500031",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/550500031/mp3",
          attribution: "(c) Carole Swann",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML491921111",
      uri: "https://macaulaylibrary.org/asset/491921111",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/491921111/mp3",
          attribution: "(c) Ethan Kang",
        },
      ],
    },
    {
      taxon_id: 18205,
      common_name: "Red-bellied Woodpecker",
      id: "ML411698511",
      uri: "https://macaulaylibrary.org/asset/411698511",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/411698511/mp3",
          attribution: "(c) David Cimprich",
        },
      ],
    },
  ],
  14850: [
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML244863131",
      uri: "https://macaulaylibrary.org/asset/244863131",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/244863131/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML457171351",
      uri: "https://macaulaylibrary.org/asset/457171351",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/457171351/mp3",
          attribution: "(c) Brian Shulist",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML612784790",
      uri: "https://macaulaylibrary.org/asset/612784790",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/612784790/mp3",
          attribution: "(c) Peter Boesman",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML365103561",
      uri: "https://macaulaylibrary.org/asset/365103561",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/365103561/mp3",
          attribution: "(c) Jim Kirker",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML203909461",
      uri: "https://macaulaylibrary.org/asset/203909461",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203909461/mp3",
          attribution: "(c) Josep del Hoyo",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML612059350",
      uri: "https://macaulaylibrary.org/asset/612059350",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/612059350/mp3",
          attribution: "(c) Guillaume Joyal",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML582382921",
      uri: "https://macaulaylibrary.org/asset/582382921",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/582382921/mp3",
          attribution: "(c) African Googre",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML242491851",
      uri: "https://macaulaylibrary.org/asset/242491851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/242491851/mp3",
          attribution: "(c) Ramit Singal",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML475811551",
      uri: "https://macaulaylibrary.org/asset/475811551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/475811551/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML59074911",
      uri: "https://macaulaylibrary.org/asset/59074911",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/59074911/mp3",
          attribution: "(c) David Brown",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML585053311",
      uri: "https://macaulaylibrary.org/asset/585053311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/585053311/mp3",
          attribution: "(c) Marc Regnier",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML581391311",
      uri: "https://macaulaylibrary.org/asset/581391311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/581391311/mp3",
          attribution: "(c) Mark Lewis",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML397983171",
      uri: "https://macaulaylibrary.org/asset/397983171",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/397983171/mp3",
          attribution: "(c) Richard Schofield",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML395141751",
      uri: "https://macaulaylibrary.org/asset/395141751",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/395141751/mp3",
          attribution: "(c) Jerred Seveyka",
        },
      ],
    },
    {
      taxon_id: 14850,
      common_name: "European Starling",
      id: "ML239860771",
      uri: "https://macaulaylibrary.org/asset/239860771",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/239860771/mp3",
          attribution: "(c) Steve Rose",
        },
      ],
    },
  ],
  9184: [
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML251342641",
      uri: "https://macaulaylibrary.org/asset/251342641",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/251342641/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML235582",
      uri: "https://macaulaylibrary.org/asset/235582",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/235582/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML395989561",
      uri: "https://macaulaylibrary.org/asset/395989561",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/395989561/mp3",
          attribution: "(c) Kalin Oca\u00f1a",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML203892031",
      uri: "https://macaulaylibrary.org/asset/203892031",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203892031/mp3",
          attribution: "(c) Joe Angseesing",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML244370091",
      uri: "https://macaulaylibrary.org/asset/244370091",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/244370091/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML105375311",
      uri: "https://macaulaylibrary.org/asset/105375311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/105375311/mp3",
          attribution: "(c) Jeff Dyck",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML498625651",
      uri: "https://macaulaylibrary.org/asset/498625651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/498625651/mp3",
          attribution: "(c) Ethan Kang",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML223802591",
      uri: "https://macaulaylibrary.org/asset/223802591",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/223802591/mp3",
          attribution: "(c) Mark Greene",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML73477541",
      uri: "https://macaulaylibrary.org/asset/73477541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/73477541/mp3",
          attribution: "(c) Michael Lester",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML372071091",
      uri: "https://macaulaylibrary.org/asset/372071091",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/372071091/mp3",
          attribution: "(c) Tom Gannon",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML628153634",
      uri: "https://macaulaylibrary.org/asset/628153634",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/628153634/mp3",
          attribution: "(c) Caleb Shingleton",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML615576379",
      uri: "https://macaulaylibrary.org/asset/615576379",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/615576379/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML520254091",
      uri: "https://macaulaylibrary.org/asset/520254091",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/520254091/mp3",
          attribution: "(c) David Drews",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML386179911",
      uri: "https://macaulaylibrary.org/asset/386179911",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/386179911/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 9184,
      common_name: "White-throated Sparrow",
      id: "ML386170011",
      uri: "https://macaulaylibrary.org/asset/386170011",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/386170011/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
  ],
  145244: [
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML316658101",
      uri: "https://macaulaylibrary.org/asset/316658101",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/316658101/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML203346201",
      uri: "https://macaulaylibrary.org/asset/203346201",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203346201/mp3",
          attribution: "(c) Jeff Graham",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML94585481",
      uri: "https://macaulaylibrary.org/asset/94585481",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/94585481/mp3",
          attribution: "(c) Matthew Schenck",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML74002571",
      uri: "https://macaulaylibrary.org/asset/74002571",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/74002571/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML140642211",
      uri: "https://macaulaylibrary.org/asset/140642211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/140642211/mp3",
          attribution: "(c) Steve Myers",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML220531961",
      uri: "https://macaulaylibrary.org/asset/220531961",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/220531961/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML350417891",
      uri: "https://macaulaylibrary.org/asset/350417891",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/350417891/mp3",
          attribution: "(c) Vincent Giroux",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML27047961",
      uri: "https://macaulaylibrary.org/asset/27047961",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/27047961/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML619010706",
      uri: "https://macaulaylibrary.org/asset/619010706",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/619010706/mp3",
          attribution: "(c) Jesse Morris",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML436167411",
      uri: "https://macaulaylibrary.org/asset/436167411",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/436167411/mp3",
          attribution: "(c) Christopher Volker",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML418595181",
      uri: "https://macaulaylibrary.org/asset/418595181",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/418595181/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML255646901",
      uri: "https://macaulaylibrary.org/asset/255646901",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/255646901/mp3",
          attribution: "(c) Chris Chappell",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML249900131",
      uri: "https://macaulaylibrary.org/asset/249900131",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/249900131/mp3",
          attribution: "(c) Tom Reed",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML217196151",
      uri: "https://macaulaylibrary.org/asset/217196151",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/217196151/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 145244,
      common_name: "Pine Warbler",
      id: "ML177711021",
      uri: "https://macaulaylibrary.org/asset/177711021",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/177711021/mp3",
          attribution: "(c) Mark Robbins",
        },
      ],
    },
  ],
  7513: [
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML539845",
      uri: "https://macaulaylibrary.org/asset/539845",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539845/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML393675451",
      uri: "https://macaulaylibrary.org/asset/393675451",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/393675451/mp3",
          attribution: "(c) James Remsen",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML306054",
      uri: "https://macaulaylibrary.org/asset/306054",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306054/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML539445",
      uri: "https://macaulaylibrary.org/asset/539445",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539445/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML609311038",
      uri: "https://macaulaylibrary.org/asset/609311038",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/609311038/mp3",
          attribution: "(c) Ben Newhouse",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML214304331",
      uri: "https://macaulaylibrary.org/asset/214304331",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/214304331/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML190201321",
      uri: "https://macaulaylibrary.org/asset/190201321",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/190201321/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML185992871",
      uri: "https://macaulaylibrary.org/asset/185992871",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/185992871/mp3",
          attribution: "(c) Reanna Thomas",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML185122241",
      uri: "https://macaulaylibrary.org/asset/185122241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/185122241/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML375222571",
      uri: "https://macaulaylibrary.org/asset/375222571",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/375222571/mp3",
          attribution: "(c) Susan Elliott",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML118206211",
      uri: "https://macaulaylibrary.org/asset/118206211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/118206211/mp3",
          attribution: "(c) Mark Greene",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML267756201",
      uri: "https://macaulaylibrary.org/asset/267756201",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/267756201/mp3",
          attribution: "(c) Benjamin Lu",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML172455511",
      uri: "https://macaulaylibrary.org/asset/172455511",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/172455511/mp3",
          attribution: "(c) Phillip Odum",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML116518851",
      uri: "https://macaulaylibrary.org/asset/116518851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/116518851/mp3",
          attribution: "(c) Jeff Graham",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML539446",
      uri: "https://macaulaylibrary.org/asset/539446",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539446/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
  ],
  14995: [
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML477168731",
      uri: "https://macaulaylibrary.org/asset/477168731",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/477168731/mp3",
          attribution: "(c) Ethan Denton",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML403077381",
      uri: "https://macaulaylibrary.org/asset/403077381",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/403077381/mp3",
          attribution: "(c) Guy McGrane",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML159704581",
      uri: "https://macaulaylibrary.org/asset/159704581",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/159704581/mp3",
          attribution: "(c) Matthew D. Medler",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML169147201",
      uri: "https://macaulaylibrary.org/asset/169147201",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/169147201/mp3",
          attribution: "(c) Kenny Frisch",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML70913491",
      uri: "https://macaulaylibrary.org/asset/70913491",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/70913491/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML162800041",
      uri: "https://macaulaylibrary.org/asset/162800041",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/162800041/mp3",
          attribution: "(c) Martha Fischer",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML467040031",
      uri: "https://macaulaylibrary.org/asset/467040031",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/467040031/mp3",
          attribution: "(c) Joey McCracken",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML465765551",
      uri: "https://macaulaylibrary.org/asset/465765551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/465765551/mp3",
          attribution: "(c) Matt Tarr",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML462258281",
      uri: "https://macaulaylibrary.org/asset/462258281",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/462258281/mp3",
          attribution: "(c) Magdalena Z",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML462258221",
      uri: "https://macaulaylibrary.org/asset/462258221",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/462258221/mp3",
          attribution: "(c) Magdalena Z",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML250375621",
      uri: "https://macaulaylibrary.org/asset/250375621",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/250375621/mp3",
          attribution: "(c) Matthew D. Medler",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML179140701",
      uri: "https://macaulaylibrary.org/asset/179140701",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/179140701/mp3",
          attribution: "(c) Doug Hitchcox",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML166646881",
      uri: "https://macaulaylibrary.org/asset/166646881",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/166646881/mp3",
          attribution: "(c) Miles Buddy",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML612795444",
      uri: "https://macaulaylibrary.org/asset/612795444",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/612795444/mp3",
          attribution: "(c) Enrique Mej\u00eda",
        },
      ],
    },
    {
      taxon_id: 14995,
      common_name: "Gray Catbird",
      id: "ML65461171",
      uri: "https://macaulaylibrary.org/asset/65461171",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/65461171/mp3",
          attribution: "(c) Jon G.",
        },
      ],
    },
  ],
  13858: [
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML387459421",
      uri: "https://macaulaylibrary.org/asset/387459421",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/387459421/mp3",
          attribution: "(c) Vishnu Vinod",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML211312851",
      uri: "https://macaulaylibrary.org/asset/211312851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/211312851/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML34691341",
      uri: "https://macaulaylibrary.org/asset/34691341",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/34691341/mp3",
          attribution: "(c) Lakshmikant Neve",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML99279871",
      uri: "https://macaulaylibrary.org/asset/99279871",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/99279871/mp3",
          attribution: "(c) Ian Hearn",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML203887271",
      uri: "https://macaulaylibrary.org/asset/203887271",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203887271/mp3",
          attribution: "(c) Joe Angseesing",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML395640541",
      uri: "https://macaulaylibrary.org/asset/395640541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/395640541/mp3",
          attribution: "(c) Jesse Morris",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML617769728",
      uri: "https://macaulaylibrary.org/asset/617769728",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/617769728/mp3",
          attribution: "(c) Paulo Narciso",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML586618561",
      uri: "https://macaulaylibrary.org/asset/586618561",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/586618561/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML570725411",
      uri: "https://macaulaylibrary.org/asset/570725411",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/570725411/mp3",
          attribution: "(c) Paulo Narciso",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML556378571",
      uri: "https://macaulaylibrary.org/asset/556378571",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/556378571/mp3",
          attribution: "(c) Paulo Narciso",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML546666051",
      uri: "https://macaulaylibrary.org/asset/546666051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/546666051/mp3",
          attribution: "(c) Jo\u00e3o Tom\u00e1s",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML218130421",
      uri: "https://macaulaylibrary.org/asset/218130421",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/218130421/mp3",
          attribution: "(c) Carl Hughes",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML104796711",
      uri: "https://macaulaylibrary.org/asset/104796711",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/104796711/mp3",
          attribution: "(c) Nelson Concei\u00e7\u00e3o",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML101186851",
      uri: "https://macaulaylibrary.org/asset/101186851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/101186851/mp3",
          attribution: "(c) Nelson Concei\u00e7\u00e3o",
        },
      ],
    },
    {
      taxon_id: 13858,
      common_name: "House Sparrow",
      id: "ML616369108",
      uri: "https://macaulaylibrary.org/asset/616369108",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/616369108/mp3",
          attribution: "(c) Ethan Denton",
        },
      ],
    },
  ],
  9602: [
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML616022769",
      uri: "https://macaulaylibrary.org/asset/616022769",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/616022769/mp3",
          attribution: "(c) Kalin Oca\u00f1a",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML92475641",
      uri: "https://macaulaylibrary.org/asset/92475641",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/92475641/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML103920231",
      uri: "https://macaulaylibrary.org/asset/103920231",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/103920231/mp3",
          attribution: "(c) David McQuade",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML224879931",
      uri: "https://macaulaylibrary.org/asset/224879931",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/224879931/mp3",
          attribution: "(c) Matthew D. Medler",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML308759071",
      uri: "https://macaulaylibrary.org/asset/308759071",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/308759071/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML41855371",
      uri: "https://macaulaylibrary.org/asset/41855371",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/41855371/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML312668391",
      uri: "https://macaulaylibrary.org/asset/312668391",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/312668391/mp3",
          attribution: "(c) James Davis",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML168713851",
      uri: "https://macaulaylibrary.org/asset/168713851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/168713851/mp3",
          attribution: "(c) Frank Pinilla",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML167925311",
      uri: "https://macaulaylibrary.org/asset/167925311",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/167925311/mp3",
          attribution: "(c) Parker Davis",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML103920201",
      uri: "https://macaulaylibrary.org/asset/103920201",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/103920201/mp3",
          attribution: "(c) David McQuade",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML615563286",
      uri: "https://macaulaylibrary.org/asset/615563286",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/615563286/mp3",
          attribution: "(c) James R. Hill, III",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML362130181",
      uri: "https://macaulaylibrary.org/asset/362130181",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/362130181/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML170188491",
      uri: "https://macaulaylibrary.org/asset/170188491",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/170188491/mp3",
          attribution: "(c) Percy Ulsamer",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML52568691",
      uri: "https://macaulaylibrary.org/asset/52568691",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/52568691/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 9602,
      common_name: "Common Grackle",
      id: "ML52415661",
      uri: "https://macaulaylibrary.org/asset/52415661",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/52415661/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
  ],
  12942: [
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML127551381",
      uri: "https://macaulaylibrary.org/asset/127551381",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/127551381/mp3",
          attribution: "(c) Kaleb Kroeker",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird (Eastern)",
      id: "ML586018511",
      uri: "https://macaulaylibrary.org/asset/586018511",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/586018511/mp3",
          attribution: "(c) Brian Shulist",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML143989251",
      uri: "https://macaulaylibrary.org/asset/143989251",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/143989251/mp3",
          attribution: "(c) Robert O'Connell",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML289950051",
      uri: "https://macaulaylibrary.org/asset/289950051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/289950051/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML277289771",
      uri: "https://macaulaylibrary.org/asset/277289771",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/277289771/mp3",
          attribution: "(c) Glen Chapman",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML270052101",
      uri: "https://macaulaylibrary.org/asset/270052101",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/270052101/mp3",
          attribution: "(c) Glen Chapman",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML174775991",
      uri: "https://macaulaylibrary.org/asset/174775991",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/174775991/mp3",
          attribution: "(c) Brian Shulist",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML236246841",
      uri: "https://macaulaylibrary.org/asset/236246841",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/236246841/mp3",
          attribution: "(c) Anne Thompson",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML164715531",
      uri: "https://macaulaylibrary.org/asset/164715531",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/164715531/mp3",
          attribution: "(c) Russ Wigh",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML57524671",
      uri: "https://macaulaylibrary.org/asset/57524671",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/57524671/mp3",
          attribution: "(c) Eric Cormier",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML305709341",
      uri: "https://macaulaylibrary.org/asset/305709341",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/305709341/mp3",
          attribution: "(c) Kristy Brig",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML256635291",
      uri: "https://macaulaylibrary.org/asset/256635291",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/256635291/mp3",
          attribution: "(c) Bruno Drolet",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML242690391",
      uri: "https://macaulaylibrary.org/asset/242690391",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/242690391/mp3",
          attribution: "(c) Kristy Brig",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML242689881",
      uri: "https://macaulaylibrary.org/asset/242689881",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/242689881/mp3",
          attribution: "(c) Kristy Brig",
        },
      ],
    },
    {
      taxon_id: 12942,
      common_name: "Eastern Bluebird",
      id: "ML614866170",
      uri: "https://macaulaylibrary.org/asset/614866170",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/614866170/mp3",
          attribution: "(c) Carole Swann",
        },
      ],
    },
  ],
  9083: [
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML337365371",
      uri: "https://macaulaylibrary.org/asset/337365371",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/337365371/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML81497091",
      uri: "https://macaulaylibrary.org/asset/81497091",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/81497091/mp3",
          attribution: "(c) Tom Reed",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML101113031",
      uri: "https://macaulaylibrary.org/asset/101113031",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/101113031/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML249823",
      uri: "https://macaulaylibrary.org/asset/249823",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/249823/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML310448821",
      uri: "https://macaulaylibrary.org/asset/310448821",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/310448821/mp3",
          attribution: "(c) Tom Marvel",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML612541661",
      uri: "https://macaulaylibrary.org/asset/612541661",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/612541661/mp3",
          attribution: "(c) David Drews",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML284999651",
      uri: "https://macaulaylibrary.org/asset/284999651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/284999651/mp3",
          attribution: "(c) Jeff Graham",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML282216971",
      uri: "https://macaulaylibrary.org/asset/282216971",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/282216971/mp3",
          attribution: "(c) Mike Austin",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML234566771",
      uri: "https://macaulaylibrary.org/asset/234566771",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/234566771/mp3",
          attribution: "(c) Mark Greene",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal (Common)",
      id: "ML601692801",
      uri: "https://macaulaylibrary.org/asset/601692801",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/601692801/mp3",
          attribution: "(c) Bill Tollefson",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML590124971",
      uri: "https://macaulaylibrary.org/asset/590124971",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/590124971/mp3",
          attribution: "(c) Vyom Vyas",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML77601451",
      uri: "https://macaulaylibrary.org/asset/77601451",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/77601451/mp3",
          attribution: "(c) Robert Bochenek",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML32205971",
      uri: "https://macaulaylibrary.org/asset/32205971",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/32205971/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML237010",
      uri: "https://macaulaylibrary.org/asset/237010",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/237010/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 9083,
      common_name: "Northern Cardinal",
      id: "ML612541663",
      uri: "https://macaulaylibrary.org/asset/612541663",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/612541663/mp3",
          attribution: "(c) David Drews",
        },
      ],
    },
  ],
  9100: [
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML609796542",
      uri: "https://macaulaylibrary.org/asset/609796542",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/609796542/mp3",
          attribution: "(c) Gavin Aquila",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML320821721",
      uri: "https://macaulaylibrary.org/asset/320821721",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/320821721/mp3",
          attribution: "(c) Dave Slager",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML132265291",
      uri: "https://macaulaylibrary.org/asset/132265291",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/132265291/mp3",
          attribution: "(c) Mason Maron",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow (melodia/atlantica)",
      id: "ML175633211",
      uri: "https://macaulaylibrary.org/asset/175633211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/175633211/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML104606851",
      uri: "https://macaulaylibrary.org/asset/104606851",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/104606851/mp3",
          attribution: "(c) Marky Mutchler",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML56691511",
      uri: "https://macaulaylibrary.org/asset/56691511",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/56691511/mp3",
          attribution: "(c) Robert Bochenek",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML81995621",
      uri: "https://macaulaylibrary.org/asset/81995621",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/81995621/mp3",
          attribution: "(c) Deborah House",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML484468111",
      uri: "https://macaulaylibrary.org/asset/484468111",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/484468111/mp3",
          attribution: "(c) V. Lohr",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML163897951",
      uri: "https://macaulaylibrary.org/asset/163897951",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/163897951/mp3",
          attribution: "(c) Wich\u2019yanan Limparungpatthanakij",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML618116461",
      uri: "https://macaulaylibrary.org/asset/618116461",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/618116461/mp3",
          attribution: "(c) James Remsen",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML539744",
      uri: "https://macaulaylibrary.org/asset/539744",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/539744/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML497018361",
      uri: "https://macaulaylibrary.org/asset/497018361",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/497018361/mp3",
          attribution: "(c) Bruce Rideout",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML206897671",
      uri: "https://macaulaylibrary.org/asset/206897671",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/206897671/mp3",
          attribution: "(c) Bruce Rideout",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML107900651",
      uri: "https://macaulaylibrary.org/asset/107900651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/107900651/mp3",
          attribution: "(c) Richard Bunn",
        },
      ],
    },
    {
      taxon_id: 9100,
      common_name: "Song Sparrow",
      id: "ML202254",
      uri: "https://macaulaylibrary.org/asset/202254",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/202254/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
  ],
  14898: [
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML116181971",
      uri: "https://macaulaylibrary.org/asset/116181971",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/116181971/mp3",
          attribution: "(c) Dan J. MacNeal",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML71682501",
      uri: "https://macaulaylibrary.org/asset/71682501",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/71682501/mp3",
          attribution: "(c) David W Foster",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML253863691",
      uri: "https://macaulaylibrary.org/asset/253863691",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/253863691/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML384769061",
      uri: "https://macaulaylibrary.org/asset/384769061",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/384769061/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML487368991",
      uri: "https://macaulaylibrary.org/asset/487368991",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/487368991/mp3",
          attribution: "(c) Kriss Replogle",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML220289871",
      uri: "https://macaulaylibrary.org/asset/220289871",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/220289871/mp3",
          attribution: "(c) Charles Law",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML131859521",
      uri: "https://macaulaylibrary.org/asset/131859521",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/131859521/mp3",
          attribution: "(c) Michael O'Brien",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML342814971",
      uri: "https://macaulaylibrary.org/asset/342814971",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/342814971/mp3",
          attribution: "(c) Lucas Schrader",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML625790296",
      uri: "https://macaulaylibrary.org/asset/625790296",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/625790296/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML625790294",
      uri: "https://macaulaylibrary.org/asset/625790294",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/625790294/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML624508944",
      uri: "https://macaulaylibrary.org/asset/624508944",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/624508944/mp3",
          attribution: "(c) JOHN KIRK",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML565071791",
      uri: "https://macaulaylibrary.org/asset/565071791",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/565071791/mp3",
          attribution: "(c) Jeff Graham",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML115378901",
      uri: "https://macaulaylibrary.org/asset/115378901",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/115378901/mp3",
          attribution: "(c) Tayler Brooks",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML267470131",
      uri: "https://macaulaylibrary.org/asset/267470131",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/267470131/mp3",
          attribution: "(c) Mike Austin",
        },
      ],
    },
    {
      taxon_id: 14898,
      common_name: "Brown Thrasher",
      id: "ML60222081",
      uri: "https://macaulaylibrary.org/asset/60222081",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/60222081/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
  ],
  17008: [
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML497847391",
      uri: "https://macaulaylibrary.org/asset/497847391",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/497847391/mp3",
          attribution: "(c) Nathaniel Sharp",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML118564711",
      uri: "https://macaulaylibrary.org/asset/118564711",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/118564711/mp3",
          attribution: "(c) Nick Kiehl",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML62526791",
      uri: "https://macaulaylibrary.org/asset/62526791",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/62526791/mp3",
          attribution: "(c) Bill Tollefson",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML525203211",
      uri: "https://macaulaylibrary.org/asset/525203211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/525203211/mp3",
          attribution: "(c) Gwen HK",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML230300261",
      uri: "https://macaulaylibrary.org/asset/230300261",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/230300261/mp3",
          attribution: "(c) Blaine Carnes",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML224046201",
      uri: "https://macaulaylibrary.org/asset/224046201",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/224046201/mp3",
          attribution: "(c) Gregg Friesen",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML158165021",
      uri: "https://macaulaylibrary.org/asset/158165021",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/158165021/mp3",
          attribution: "(c) Joanna Reuter",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML60926701",
      uri: "https://macaulaylibrary.org/asset/60926701",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/60926701/mp3",
          attribution: "(c) Gregory Zbitnew",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML60442021",
      uri: "https://macaulaylibrary.org/asset/60442021",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/60442021/mp3",
          attribution: "(c) Glen Chapman",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML20848341",
      uri: "https://macaulaylibrary.org/asset/20848341",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/20848341/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML614032243",
      uri: "https://macaulaylibrary.org/asset/614032243",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/614032243/mp3",
          attribution: "(c) Guillaume Perron",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML559533091",
      uri: "https://macaulaylibrary.org/asset/559533091",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/559533091/mp3",
          attribution: "(c) Seth Honig",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML501762281",
      uri: "https://macaulaylibrary.org/asset/501762281",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/501762281/mp3",
          attribution: "(c) Judy Behrens",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML218006981",
      uri: "https://macaulaylibrary.org/asset/218006981",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/218006981/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 17008,
      common_name: "Eastern Phoebe",
      id: "ML132008131",
      uri: "https://macaulaylibrary.org/asset/132008131",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/132008131/mp3",
          attribution: "(c) David McQuade",
        },
      ],
    },
  ],
  10094: [
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML274370831",
      uri: "https://macaulaylibrary.org/asset/274370831",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/274370831/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML126648381",
      uri: "https://macaulaylibrary.org/asset/126648381",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/126648381/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML613662164",
      uri: "https://macaulaylibrary.org/asset/613662164",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/613662164/mp3",
          attribution: "(c) Ethan Kang",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco",
      id: "ML454326541",
      uri: "https://macaulaylibrary.org/asset/454326541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/454326541/mp3",
          attribution: "(c) Ben Newhouse",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco",
      id: "ML418968001",
      uri: "https://macaulaylibrary.org/asset/418968001",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/418968001/mp3",
          attribution: "(c) Daniel Jauvin",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML249566231",
      uri: "https://macaulaylibrary.org/asset/249566231",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/249566231/mp3",
          attribution: "(c) Julia Plummer",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco",
      id: "ML103365551",
      uri: "https://macaulaylibrary.org/asset/103365551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/103365551/mp3",
          attribution: "(c) Martha Fischer",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML29905611",
      uri: "https://macaulaylibrary.org/asset/29905611",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/29905611/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco",
      id: "ML306067",
      uri: "https://macaulaylibrary.org/asset/306067",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/306067/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML410032541",
      uri: "https://macaulaylibrary.org/asset/410032541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/410032541/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML201165",
      uri: "https://macaulaylibrary.org/asset/201165",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/201165/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML74372051",
      uri: "https://macaulaylibrary.org/asset/74372051",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/74372051/mp3",
          attribution: "(c) Ted Floyd",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco",
      id: "ML84601901",
      uri: "https://macaulaylibrary.org/asset/84601901",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/84601901/mp3",
          attribution: "(c) Glen Chapman",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco (Slate-colored)",
      id: "ML75918601",
      uri: "https://macaulaylibrary.org/asset/75918601",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/75918601/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 10094,
      common_name: "Dark-eyed Junco",
      id: "ML588958101",
      uri: "https://macaulaylibrary.org/asset/588958101",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/588958101/mp3",
          attribution: "(c) Nate Peterson",
        },
      ],
    },
  ],
  3454: [
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML171111241",
      uri: "https://macaulaylibrary.org/asset/171111241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/171111241/mp3",
          attribution: "(c) Steven Biggers",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML64708561",
      uri: "https://macaulaylibrary.org/asset/64708561",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/64708561/mp3",
          attribution: "(c) Robert Bochenek",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML27058141",
      uri: "https://macaulaylibrary.org/asset/27058141",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/27058141/mp3",
          attribution: "(c) Anonymous",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML476564891",
      uri: "https://macaulaylibrary.org/asset/476564891",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/476564891/mp3",
          attribution: "(c) Paul Fenwick",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML251125461",
      uri: "https://macaulaylibrary.org/asset/251125461",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/251125461/mp3",
          attribution: "(c) Phoebe Barnes",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML254532861",
      uri: "https://macaulaylibrary.org/asset/254532861",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/254532861/mp3",
          attribution: "(c) Gary Leavens",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML482839691",
      uri: "https://macaulaylibrary.org/asset/482839691",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/482839691/mp3",
          attribution: "(c) Thomas Barnwell",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML223967541",
      uri: "https://macaulaylibrary.org/asset/223967541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/223967541/mp3",
          attribution: "(c) valerie heemstra",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML622860897",
      uri: "https://macaulaylibrary.org/asset/622860897",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/622860897/mp3",
          attribution: "(c) Rick Keyser",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML589962481",
      uri: "https://macaulaylibrary.org/asset/589962481",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/589962481/mp3",
          attribution: "(c) Z .",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML163393591",
      uri: "https://macaulaylibrary.org/asset/163393591",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/163393591/mp3",
          attribution: "(c) Colin Sumrall",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML248659681",
      uri: "https://macaulaylibrary.org/asset/248659681",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/248659681/mp3",
          attribution: "(c) Charles Hundertmark",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML148505651",
      uri: "https://macaulaylibrary.org/asset/148505651",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/148505651/mp3",
          attribution: "(c) Gregory Zbitnew",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML147736541",
      uri: "https://macaulaylibrary.org/asset/147736541",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/147736541/mp3",
          attribution: "(c) Robert O'Connell",
        },
      ],
    },
    {
      taxon_id: 3454,
      common_name: "Mourning Dove",
      id: "ML518056861",
      uri: "https://macaulaylibrary.org/asset/518056861",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/518056861/mp3",
          attribution: "(c) Ethan Kang",
        },
      ],
    },
  ],
  9424: [
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML384770161",
      uri: "https://macaulaylibrary.org/asset/384770161",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/384770161/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML108934141",
      uri: "https://macaulaylibrary.org/asset/108934141",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/108934141/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML578522941",
      uri: "https://macaulaylibrary.org/asset/578522941",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/578522941/mp3",
          attribution: "(c) Julia Plummer",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML87510721",
      uri: "https://macaulaylibrary.org/asset/87510721",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/87510721/mp3",
          attribution: "(c) David W Foster",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML375524481",
      uri: "https://macaulaylibrary.org/asset/375524481",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/375524481/mp3",
          attribution: "(c) Alexandre Terrigeol",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML336375941",
      uri: "https://macaulaylibrary.org/asset/336375941",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/336375941/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML98683691",
      uri: "https://macaulaylibrary.org/asset/98683691",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/98683691/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML26131551",
      uri: "https://macaulaylibrary.org/asset/26131551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/26131551/mp3",
          attribution: "(c) Colin Sumrall",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML139494",
      uri: "https://macaulaylibrary.org/asset/139494",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/139494/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML269602421",
      uri: "https://macaulaylibrary.org/asset/269602421",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/269602421/mp3",
          attribution: "(c) Nathaniel Sharp",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML230180951",
      uri: "https://macaulaylibrary.org/asset/230180951",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/230180951/mp3",
          attribution: "(c) Matthew Brown",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML219898041",
      uri: "https://macaulaylibrary.org/asset/219898041",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/219898041/mp3",
          attribution: "(c) Peter Kaestner",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML88565591",
      uri: "https://macaulaylibrary.org/asset/88565591",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/88565591/mp3",
          attribution: "(c) Michael Plauch\u00e9",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML64464441",
      uri: "https://macaulaylibrary.org/asset/64464441",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/64464441/mp3",
          attribution: "(c) Steven Biggers",
        },
      ],
    },
    {
      taxon_id: 9424,
      common_name: "Eastern Towhee",
      id: "ML101317861",
      uri: "https://macaulaylibrary.org/asset/101317861",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/101317861/mp3",
          attribution: "(c) Jim Ferrari",
        },
      ],
    },
  ],
  10227: [
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML534429",
      uri: "https://macaulaylibrary.org/asset/534429",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/534429/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML105156921",
      uri: "https://macaulaylibrary.org/asset/105156921",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/105156921/mp3",
          attribution: "(c) Ryan Sanderson",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML359884261",
      uri: "https://macaulaylibrary.org/asset/359884261",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/359884261/mp3",
          attribution: "(c) Jim Fuehrmeyer",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML353111041",
      uri: "https://macaulaylibrary.org/asset/353111041",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/353111041/mp3",
          attribution: "(c) Glen Chapman",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML114612381",
      uri: "https://macaulaylibrary.org/asset/114612381",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/114612381/mp3",
          attribution: "(c) Mark Greene",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML202238",
      uri: "https://macaulaylibrary.org/asset/202238",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/202238/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML249513581",
      uri: "https://macaulaylibrary.org/asset/249513581",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/249513581/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML246028811",
      uri: "https://macaulaylibrary.org/asset/246028811",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/246028811/mp3",
          attribution: "(c) Sean Smith",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML175641491",
      uri: "https://macaulaylibrary.org/asset/175641491",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/175641491/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML98062121",
      uri: "https://macaulaylibrary.org/asset/98062121",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/98062121/mp3",
          attribution: "(c) Anne Thompson",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML31406781",
      uri: "https://macaulaylibrary.org/asset/31406781",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/31406781/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML87184551",
      uri: "https://macaulaylibrary.org/asset/87184551",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/87184551/mp3",
          attribution: "(c) Juan D Astorga",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML67072091",
      uri: "https://macaulaylibrary.org/asset/67072091",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/67072091/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML28211241",
      uri: "https://macaulaylibrary.org/asset/28211241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/28211241/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 10227,
      common_name: "Indigo Bunting",
      id: "ML465072571",
      uri: "https://macaulaylibrary.org/asset/465072571",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/465072571/mp3",
          attribution: "(c) Marie Giroux",
        },
      ],
    },
  ],
  9744: [
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML166781601",
      uri: "https://macaulaylibrary.org/asset/166781601",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/166781601/mp3",
          attribution: "(c) Miles Buddy",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML321530751",
      uri: "https://macaulaylibrary.org/asset/321530751",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/321530751/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML617319994",
      uri: "https://macaulaylibrary.org/asset/617319994",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/617319994/mp3",
          attribution: "(c) James Remsen",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird (Red-winged)",
      id: "ML203890211",
      uri: "https://macaulaylibrary.org/asset/203890211",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/203890211/mp3",
          attribution: "(c) Joe Angseesing",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML621547620",
      uri: "https://macaulaylibrary.org/asset/621547620",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/621547620/mp3",
          attribution: "(c) Kriss Replogle",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML617320249",
      uri: "https://macaulaylibrary.org/asset/617320249",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/617320249/mp3",
          attribution: "(c) James Remsen",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird (Red-winged)",
      id: "ML63170391",
      uri: "https://macaulaylibrary.org/asset/63170391",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/63170391/mp3",
          attribution: "(c) Jay McGowan",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML240122191",
      uri: "https://macaulaylibrary.org/asset/240122191",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/240122191/mp3",
          attribution: "(c) James (Jim) Holmes",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird (Red-winged)",
      id: "ML352388001",
      uri: "https://macaulaylibrary.org/asset/352388001",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/352388001/mp3",
          attribution: "(c) Peder Svingen",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird (Red-winged)",
      id: "ML459804471",
      uri: "https://macaulaylibrary.org/asset/459804471",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/459804471/mp3",
          attribution: "(c) Jeff Ellerbusch",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML249827",
      uri: "https://macaulaylibrary.org/asset/249827",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/249827/mp3",
          attribution: "(c) Wil Hershberger",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird (Red-winged)",
      id: "ML418566441",
      uri: "https://macaulaylibrary.org/asset/418566441",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/418566441/mp3",
          attribution: "(c) Brad Walker",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML54684431",
      uri: "https://macaulaylibrary.org/asset/54684431",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/54684431/mp3",
          attribution: "(c) Paul Marvin",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML617068244",
      uri: "https://macaulaylibrary.org/asset/617068244",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/617068244/mp3",
          attribution: "(c) Sean HH",
        },
      ],
    },
    {
      taxon_id: 9744,
      common_name: "Red-winged Blackbird",
      id: "ML591168581",
      uri: "https://macaulaylibrary.org/asset/591168581",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/591168581/mp3",
          attribution: "(c) Kevin Seymour",
        },
      ],
    },
  ],
};
