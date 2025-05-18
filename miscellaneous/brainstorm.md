TODO

Things to tune:

- EMA parameter
- iNaturalist initial confusion value multiplier
- iNaturalist minimum confusion value
- Default confusion value
- Max group size
- Predicted accuracy threshold for limiting group size
- Confusion values within and between configured groups
- Sorting score algorithm, and proficiency thresholds

\*Priority: Location-based common species sorting - species counts only returns species, so might be tricky for genera, families, etc.

Teaching page, where it shows you several examples of each taxon next to each other? Have info links for each taxon on that page. Number of examples could be adjusted based on number of taxa. If 2 taxa, show 2-3 examples each. If 4 taxa, maybe 2 examples each. More than that, just do 1 example each.

Allow groups to be configured. Issue - custom groups won't update local storage because no iNaturalist data fetched yet. Fix this by disallowing local storage update if no iNaturalist AND no conf value from a custom grouping

It's possible for a group to be created with one species it seems (see turtle preset). I believe only one such group can be created, otherwise they would be merged. Could add it to the group with extra space containing the most similar taxon, but what if all groups are full? Probably the best thing to do is just add it to the group containing its most similar taxon. This might result in one group being over the limit, but maybe that's okay.

Sidescrolling in location search results list

Chipmunk intruder

Warbler field marks game!

---

Better recommendation brainstorming:

For each pair of birds, count how many times the two were confused.

Problem - unbalanced practicing, if some birds are practiced more their counts will be higher even if a person is confusing them a smaller fraction of the time.

Fix this by normalizing by the number of questions asked where it's possible to confuse the two birds (where the question is about one of the two birds, and both birds are present as possible answers)

Problem - what happens if you are studying chip calls, and do one practice set with just two birds for a while, and another with 10 birds all with chip calls? Say you are about equally confused between any pair of any of these birds (to simplify, say you are basically randomly guessing). Consider questions just about cardinals, for sake of argument. Every question is a chance to confuse cardinal with anything else, so the denominator goes up for all pairs with cardinal in them. In the game with a cardinal and an indigo bunting, the number of times cardinal is confused with indigo bunting is 1/2 the questions. So (# times confused / # opportunities to confuse) = 1/2. In the game with ten birds, the number of times cardinal confused with indigo bunting is 1/10 the questions. So (# times confused / # opportunities to confuse) = 1/10. Since the denominator is the same, the small game will make you artificially look better at telling the difference between cardinals and indigo buntings, when this is not the case.

Perhaps the fix to this is to use random guessing as a baseline. Something like observing whether you confuse two birds more than expected on average if you were randomly guessing. This requires a way to estimate expectation if randomly guessing. A simple way is to use the number of birds currently in play. Test - 10 cardinal questions, 10 birds, guess each bird once. If randomly guessing, score is (1 - 1 / 10). If always correct

A related idea - scale our ratio by the number of birds in the current game? This fixes the long problem above (1/2 _2 becomes 1, and 1/10 _ 10 becomes 1, and if you were doing better, e.g. 1/4 confused instead of 1/2, then our number becomes 1/2). This has the weakness of if there are a bunch of other unrelated birds in play that you always get right (so never confuse), they seem like they shouldn't affect how much you're confusing the cardinal and the indigo bunting??

Another (probably right) idea - ignore cases where a bird other than the cardinal or the indigo bunting was identified. These aren't part of the numerator or denominator.

---

Consider adjusting N_OBS_PER_TAXON based on number of taxa (fewer taxa = larger threshold b/c more likely to repeat)

Other filtering? Though current sounds are fairly good I think

- do some experimentation listening to with photos vs without photos, and number of identifications
- and evaluate more rigorously the idea that popular recordings are better

Process audio - https://www.youtube.com/watch?v=GYqogvHYn28

- tips for JS: https://stackoverflow.com/questions/22233037/how-to-apply-basic-audio-filter-using-javascript
- CAN'T DO THIS, BLOCKED BY SAME ORIGIN POLICY

Audio filtering

- popular observations are all very good (from a brief test)
- observation comment might mean something had to be clarified?
  - this doesn't seem to be true in general
- observations with more identifications are easier?
- observations without photos - rely only upon sound
- audio clips that aren't that long - less chance of a ton of silence before hearing the bird

Customization

- setting to not include the "other" red herrings
- setting to load sounds distributed how they are in nature, not evenly among taxa

Design goals

Practice identifying bird species based on their calls

- select bird species to practice
- have nonselected species show up too

Practice identifying birds based on appearance

- at the order, family, genus, species levels

Don't rely on downloaded csv for observations (more flexible)
