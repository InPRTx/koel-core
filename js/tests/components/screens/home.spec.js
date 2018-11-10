import Home from '@/components/screens/home.vue'
import AlbumItem from '@/components/album/card.vue'
import ArtistItem from '@/components/artist/card.vue'
import HomeSongItem from '@/components/song/home-item.vue'
import factory from '@/tests/factory'
import { event } from '@/utils'

describe.skip('components/screens/home', () => {
  let data
  beforeEach(() => {
    const artists = factory('artist', 5, {
      songs: factory('song', 3),
      albums: factory('album', 2)
    })

    data = {
      recentSongs: factory('song', 7),
      top: {
        artists,
        songs: factory('song', 4),
        albums: factory('album', 6)
      },
      recentlyAdded: {
        albums: factory('album', 3),
        songs: factory('song', 10)
      }
    }
  })

  it('displays all sections', async done => {
    const wrapper = await mount(Home, { data: () => data })

    Vue.nextTick(() => {
      wrapper.find('h1.heading span').text().should.not.be.empty
      wrapper.find('.top-song-list').findAll(HomeSongItem).should.have.lengthOf(4)
      wrapper.find('.recent-song-list').findAll(HomeSongItem).should.have.lengthOf(7)

      const recentlyAddedSection = wrapper.find('.recently-added')
      recentlyAddedSection.findAll(AlbumItem).should.have.lengthOf(3)
      recentlyAddedSection.findAll(HomeSongItem).should.have.lengthOf(10)

      wrapper.find('.top-artists').findAll(ArtistItem).should.have.lengthOf(5)
      wrapper.find('.top-albums').findAll(AlbumItem).should.have.lengthOf(6)
      done()
    })
  })

  it('refreshes when a new song is played', async done => {
    const wrapper = await mount(Home)

    Vue.nextTick(() => {
      const refreshDashboardStub = stub(wrapper.vm, 'refreshDashboard')
      event.emit('SONG_PLAYED', factory('song'))
      refreshDashboardStub.called.should.be.true
      refreshDashboardStub.restore()
      done()
    })
  })
})