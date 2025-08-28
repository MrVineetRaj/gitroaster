import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { GitHubRepo } from "./types";
import { caller } from "@/trpc/server";
import crypto from "crypto";

class GithubOctokit {
  appOctokit: Octokit;

  constructor() {
    this.appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_APP_ID,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"), // if stored with escaped newlines
        clientId: process.env.GITHUB_APP_CLIENT_ID,
        clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
      },
    });
  }

  async getEnabledRepoForGitRoaster(
    username: string,
    orgname: string,
    installationId: string
  ) {
    const appOctokit = this.appOctokit;

    if (username === orgname) {
      // let installationFound = false;
      if (installationId != "00000") {
        try {
          const tokenResponse = await appOctokit.request(
            "POST /app/installations/{installation_id}/access_tokens",
            { installation_id: Number(installationId) }
          );

          const installationAccessToken = tokenResponse.data.token;

          const installationOctokit = new Octokit({
            auth: installationAccessToken,
          });

          const reposResponse =
            await installationOctokit.apps.listReposAccessibleToInstallation();

          const repos: GitHubRepo[] = reposResponse.data
            .repositories as GitHubRepo[];

          return {
            success: true,
            message: "INSTALLATION_FOUND",
            repos: repos,
            installationIdFromGithub: installationId,
          };
        } catch (error) {
          try {
            const { data: installations } =
              await appOctokit.apps.listInstallations();
            // const installations = installationsResponse.data;

            let installationIdForCurrentUser: string | null = null;

            for (const installation of installations) {
              if (installation?.account?.login === username) {
                installationIdForCurrentUser = String(
                  installation.id
                ) as string;
              }
            }

            if (!installationIdForCurrentUser) {
              return {
                success: false,
                message: "INSTALLATION_NOT_FOUND",
                repos: [],
                installationIdFromGithub: "",
              };
            }

            await caller.userRouter.updateInstallationId({
              installationId: installationIdForCurrentUser,
              orgname,
            });

            const installationOctokit = new Octokit({
              auth: installationIdForCurrentUser,
            });

            const reposResponse =
              await installationOctokit.apps.listReposAccessibleToInstallation();

            const repos: GitHubRepo[] = reposResponse.data
              .repositories as GitHubRepo[];

            return {
              success: true,
              message: "INSTALLATION_FOUND_AND_UPDATED",
              repos: repos,
              installationIdFromGithub: installationIdForCurrentUser,
            };
          } catch (error) {
            return {
              success: false,
              message: "INSTALLATION_NOT_FOUND",
              repos: [],
              installationIdFromGithub: "",
            };
          }
        }
      } else {
        try {
          const { data: installations } =
            await appOctokit.apps.listInstallations();
          // const installations = installationsResponse.data;

          let installationIdForCurrentUser: string | null = null;

          for (const installation of installations) {
            if (installation?.account?.login === username) {
              installationIdForCurrentUser = String(installation.id) as string;
            }
          }

          if (!installationIdForCurrentUser) {
            return {
              success: false,
              message: "INSTALLATION_NOT_FOUND",
              repos: [],
              installationIdFromGithub: "",
            };
          }

          await caller.userRouter.updateInstallationId({
            installationId: installationIdForCurrentUser,
            orgname,
          });

          const installationOctokit = new Octokit({
            auth: installationIdForCurrentUser,
          });

          const reposResponse =
            await installationOctokit.apps.listReposAccessibleToInstallation();

          const repos: GitHubRepo[] = reposResponse.data
            .repositories as GitHubRepo[];

          return {
            success: true,
            message: "INSTALLATION_FOUND_AND_UPDATED",
            repos: repos,
            installationIdFromGithub: installationIdForCurrentUser,
          };
        } catch (error) {
          return {
            success: false,
            message: "INSTALLATION_NOT_FOUND",
            repos: [],
            installationIdFromGithub: "",
          };
        }
      }
    } else {
      // console.log(orgname, username);
      if (installationId != "00000") {
        try {
          const tokenResponse = await appOctokit.request(
            "POST /app/installations/{installation_id}/access_tokens",
            { installation_id: Number(installationId) }
          );

          const installationAccessToken = tokenResponse.data.token;

          const installationOctokit = new Octokit({
            auth: installationAccessToken,
          });

          const reposResponse =
            await installationOctokit.apps.listReposAccessibleToInstallation();

          const repos: GitHubRepo[] = reposResponse.data
            .repositories as GitHubRepo[];

          return {
            success: true,
            message: "INSTALLATION_FOUND",
            repos: repos,
            installationIdFromGithub: installationId,
          };
        } catch (error) {
          try {
            const { data: installations } =
              await appOctokit.apps.listInstallations();
            let installationIdForCurrentOrg: string | null = null;
            for (const installation of installations) {
              if (installation?.account?.login === orgname) {
                installationIdForCurrentOrg = String(installation.id) as string;
              }
            }

            if (!installationIdForCurrentOrg) {
              return {
                success: false,
                message: "INSTALLATION_NOT_FOUND",
                repos: [],
                installationIdFromGithub: "",
              };
            }

            await caller.userRouter.updateInstallationId({
              installationId: installationIdForCurrentOrg,
              orgname,
            });

            const installationOctokit = new Octokit({
              auth: installationIdForCurrentOrg,
            });

            const reposResponse =
              await installationOctokit.apps.listReposAccessibleToInstallation();

            const repos: GitHubRepo[] = reposResponse.data
              .repositories as GitHubRepo[];

            return {
              success: true,
              message: "INSTALLATION_FOUND",
              repos: repos,
              installationIdFromGithub: installationIdForCurrentOrg,
            };
          } catch (error) {
            return {
              success: false,
              message: "INSTALLATION_NOT_FOUND",
              repos: [],
              installationIdFromGithub: "",
            };
          }
        }
      } else {
        try {
          const { data: installations } =
            await appOctokit.apps.listInstallations();
          let installationIdForCurrentOrg: string | null = null;
          for (const installation of installations) {
            if (installation?.account?.login === orgname) {
              installationIdForCurrentOrg = String(installation.id) as string;
            }
          }

          if (!installationIdForCurrentOrg) {
            return {
              success: false,
              message: "INSTALLATION_NOT_FOUND",
              repos: [],
              installationIdFromGithub: "",
            };
          }

          await caller.userRouter.updateInstallationId({
            installationId: installationIdForCurrentOrg,
            orgname,
          });

          const installationOctokit = new Octokit({
            auth: installationIdForCurrentOrg,
          });

          const reposResponse =
            await installationOctokit.apps.listReposAccessibleToInstallation();

          const repos: GitHubRepo[] = reposResponse.data
            .repositories as GitHubRepo[];

          return {
            success: true,
            message: "INSTALLATION_FOUND",
            repos: repos,
            installationIdFromGithub: installationIdForCurrentOrg,
          };
        } catch (error) {
          return {
            success: false,
            message: "INSTALLATION_NOT_FOUND",
            repos: [],
            installationIdFromGithub: "",
          };
        }
      }
    }
  }
  async differenceData(installation_id: string, diff_url: string) {
    try {
      const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: process.env.GITHUB_APP_ID!,
          privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
          installationId: installation_id, // Use the parameter, not env var
        },
      });

      const urlMatch = diff_url.match(
        /github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/
      );
      if (!urlMatch) throw new Error("Invalid diff URL");

      const [, owner, repo, pull_number] = urlMatch;

      // Type the auth result properly
      const authResult = (await octokit.auth({
        type: "installation",
        installationId: installation_id,
      })) as { token: string };

      const { token } = authResult;
      if (!token) {
        return {
          success: false,
          message: "UNAUTHORIZED",
          data: null,
          owner: null,
          repo: null,
          pull_number: null,
        };
      }

      const diffResponse = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: parseInt(pull_number),
        mediaType: {
          format: "diff",
        },
      });

      return {
        success: true,
        data: diffResponse.data,
        message: "",
        owner,
        repo,
        pull_number,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
          data: null,
          owner: null,
          repo: null,
          pull_number: null,
        };
      }

      return {
        success: false,
        message: "Error loading the difference",
        data: null,
        owner: null,
        repo: null,
        pull_number: null,
      };
    }
  }

  async getOwnerOrgs(access_token: string) {
    const octokit = new Octokit({ auth: access_token });

    const orgs = await octokit.rest.orgs.listForAuthenticatedUser();

    const ownerOrgs: string[] = [];

    for (const org of orgs.data) {
      const membership =
        await octokit.rest.orgs.getMembershipForAuthenticatedUser({
          org: org.login,
        });
      if (membership.data.role === "admin") {
        ownerOrgs.push(org.login);
      }
    }

    return ownerOrgs || [];
  }

  async parseGithubWebhookRequest(
    bodyArrayBuffer: ArrayBuffer,
    signature: string
  ) {
    try {
      // Read raw body as ArrayBuffer and convert to Buffer
      const bodyBuffer = Buffer.from(bodyArrayBuffer);
      const bodyString = bodyBuffer.toString("utf8");

      const GITHUB_APP_WEBHOOK_SECRET = process.env.GITHUB_APP_WEBHOOK_SECRET;

      if (!GITHUB_APP_WEBHOOK_SECRET) {
        return {
          message: "INVALID_SIGNATURE",
          status: 401,
          success: false,
        };
      }

      // Compute HMAC digest
      const hmac = crypto.createHmac("sha256", GITHUB_APP_WEBHOOK_SECRET);
      const digest = "sha256=" + hmac.update(bodyString).digest("hex");

      // Compare signatures securely
      const signatureBuffer = Buffer.from(signature);
      const digestBuffer = Buffer.from(digest);

      if (
        signatureBuffer.length !== digestBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, digestBuffer)
      ) {
        return {
          message: "INVALID_SIGNATURE",
          status: 401,
          success: false,
        };
      }

      // Signature validated ✅
      const data = JSON.parse(bodyString);
      return {
        status: 200,
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        message: "SOMETHING_WRONG",
        status: 400,
        success: false,
      };
    }
  }
}

export const githubOctokit = new GithubOctokit();
