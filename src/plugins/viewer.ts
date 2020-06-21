import fp from 'fastify-plugin';
import { PlayerObject } from '../@types/fastify';
import StarCraft2API from 'starcraft2-api';

const ranks = [
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond',
  'master',
  'grandmaster',
] as string[];

export default fp(async (server, {}, next) => {
  const calculateHighestRank = (soloRank?: string, teamRank?: string) => {
    const soloRankIndex = soloRank
      ? ranks.indexOf(soloRank.toLowerCase())
      : -1;

    const teamRankIndex = teamRank
      ? ranks.indexOf(teamRank.toLowerCase())
      : -1;

    return soloRankIndex > teamRankIndex
      ? soloRank
        ? soloRank.toLowerCase()
        : ''
      : teamRank
        ? teamRank.toLowerCase()
        : '';
  };

  const getHeading = (apiData: any, regionName: string) => {
    const { data } = apiData;
    const {
      summary,
      career,
    } = data;

    return {
      portrait: {
        url: summary.portrait,
        frame: calculateHighestRank(
          career.current1v1LeagueName,
          career.currentBestTeamLeagueName,
        ),
      },
      player: {
        clan: {
          name: summary.clanName,
          tag: summary.clanTag,
        },
        name: summary.displayName,
        server: regionName,
      },
    };
  };

  const getProfileData = async (profile: PlayerObject) => {
    try {
      const data = await server.sas.getProfile(profile);
      const regionName = StarCraft2API.getRegionNameById(profile.regionId)[0];
      const heading = getHeading(data, regionName);
      return {
        heading,
      };
    } catch {
      return {
        heading: {},
        details: {
          snapshot: {},
          stats: {},
          history: {},
        },
      };
    }
  };

  const getData = async (profiles: PlayerObject[]) => {
    try {
      const profileData = await Promise.all(
        profiles.map(async profile => await getProfileData(profile)),
      );
      return {
        profiles: profileData,
      };
    } catch {
      return [];
    }
    // const profileData = [] as any[];

    // // profiles.map((profile) => {
    //   // console.log('lol iterating');
    //   // const profileDataObject = await getProfileData(profile);
    //   // profileData.push(profileDataObject);
    //   // const index = profiles.indexOf(profile);
    //   // const timeoutInterval = index * 1000;

    // for (const profile of profiles) {
    //   console.log(profile);
    //   getProfileData(profile);
    //   console.log(profile.summary);
    //   // console.log('yo interuje!!!');
    //   // console.log(profile);
    //   // const dataObject = await getProfileData(profile);
    //   // console.log(dataObject);
    //   // console.log(profileData);
    //   // await profileData.push(dataObject);
    // }

    // return profileData;
  };
    // return {
    //   lol: 'lul',
    // };
    // const profileData = [];
    // return await Promise.all(
    //   profiles.map(profile =>
    //     new Promise((resolve, {}) => {
    //       console.log('pushing data...');
    //       const profileDataObject = getProfileData(profile);
    //       setTimeout(
    //         () => {
    //           profileData.push(profileDataObject);
    //           resolve();
    //         },
    //         profiles.indexOf(profile) * 1000,
    //       );
    //     }),
    //   ),
    // );
    // try {
    //   Promise.all(
    //   )
    // } catch (error) {
    //   console.log(error);
    //   return {
    //     profiles: [],
    //   };
    // }

  server.decorate('viewer', { getData });

  next();
});