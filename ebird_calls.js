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
  alert(
    "No bird call data is available for: " +
      failedNames.join(", ") +
      ". This doesn't break anything, just no questions will be about these species."
  );
}

const eBirdCalls = {
  144814: [
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
      id: "ML229241",
      uri: "https://macaulaylibrary.org/asset/229241",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/229241/mp3",
          attribution: "(c) Bob McGuire",
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
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML56354181",
      uri: "https://macaulaylibrary.org/asset/56354181",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/56354181/mp3",
          attribution: "(c) Darrell Peterson",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML407547061",
      uri: "https://macaulaylibrary.org/asset/407547061",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/407547061/mp3",
          attribution: "(c) Carole Swann",
        },
      ],
    },
    {
      taxon_id: 13632,
      common_name: "Tufted Titmouse",
      id: "ML93696121",
      uri: "https://macaulaylibrary.org/asset/93696121",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/93696121/mp3",
          attribution: "(c) Bates Estabrooks",
        },
      ],
    },
  ],
  7513: [
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
      id: "ML225987",
      uri: "https://macaulaylibrary.org/asset/225987",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/225987/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML225980",
      uri: "https://macaulaylibrary.org/asset/225980",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/225980/mp3",
          attribution: "(c) Bob McGuire",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML209352",
      uri: "https://macaulaylibrary.org/asset/209352",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/209352/mp3",
          attribution: "(c) Julia Ferguson",
        },
      ],
    },
    {
      taxon_id: 7513,
      common_name: "Carolina Wren",
      id: "ML9202",
      uri: "https://macaulaylibrary.org/asset/9202",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/9202/mp3",
          attribution: "(c) Robert C. Stein",
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
      common_name: "Northern Cardinal",
      id: "ML112655",
      uri: "https://macaulaylibrary.org/asset/112655",
      sounds: [
        {
          file_url:
            "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/112655/mp3",
          attribution: "(c) Curtis Marantz",
        },
      ],
    },
  ],
};
